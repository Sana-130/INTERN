const bcrypt = require('bcrypt');
const { pool } = require('../db/db-service');
const { jwtGenerator, createRefreshToken , tokenJwt} = require('../utils/TokenGenerator');
const ROLES = require('../utils/roles');
const sendConfirmationEmail = require('../utils/emailService');
const jwt = require('jsonwebtoken');

require("dotenv").config();



const getUserTypeByName = async (typeName) => {
  try {
    const type = await pool.query('SELECT * FROM userType where role = $1', [typeName]);
    if (type.rows.length === 0) {
      return false;
    }
    return type;
  } catch (err) {
    console.log('error', err);
  }
};

const signupStudent = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userType = await getUserTypeByName(ROLES.Student);

    if (!userType) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const type = userType.rows[0];

    const user = await pool.query('SELECT * FROM user_info WHERE email = $1', [email]);

    if (user.rows.length > 0) {
      return res.status(401).json('User already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      'INSERT INTO user_info (email, password, usertype_id) VALUES ($1, $2, $3) RETURNING *',
      [email, bcryptPassword, type.id]
    );

    const userId = newUser.rows[0].user_id;
    await sendConfirmationEmail(userId, email);

    return res.status(200).send('Successfully signed up');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add other signup methods as needed

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await pool.query('SELECT * FROM user_info WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json("User doesn't exist!");
    }
    //const token = await pool.query('SELECT * FROM Token WHERE user_id = $1', [user.rows[0].user_id]);
    const token = jwt.sign(
      {id: user.rows[0].user_id},
      process.env.RESET_PASSWORD,
      {expiresIn:'10m'}); 

    try{
      await pool.query('UPDATE user_info SET resetToken = $1 WHERE user_id = $2', [token, user.rows[0].user_id]);
    }catch(err){
      return res.status(401).json("token invalid");
    }
    const url = `http://localhost:3000/reset-password/${token}`;
    try {
        // Send the confirmation email
        await transporter.sendMail({
          to: email,
          subject: 'Reset Password Link',
          html: `Please click this email to reset your password: <a href="${url}">click here</a>`,
      });
    
        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
        // Handle the error (e.g., log it, return an error response)
    }

    // Implement logic for forgot password
  } catch (err) {
    console.error(err);
  }
};


const confirmResetToken = async(req, res) =>{

  try{
    const {token, password} = req.body;
    
    jwt.verify(token, process.env.RESET_PASSWORD, function(error, decodedToken) {
        if(error){
          return res.status(400).json({error: 'Incorrect token or expired'});
        }
    })
    const user = await pool.query('SELECT * FROM user_info WHERE resetToken = $1', [token]);
    if(user.rows.length==0){
      return res.status(400).json({error : "User with this token not found"});
    }
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    try{
      await pool.query('UPDATE user_info SET password = $1 ', [bcryptPassword]);
    }catch(err){
      return res.status(401).json("error saving new password");
    }
    
  }catch(err){
    res.status(400).json({error: err});
  }
}



const confirmation = async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const decodedToken = jwt.verify(tokenId, process.env.EMAIL_SECRET);

    if (!decodedToken || !decodedToken.user || !decodedToken.user.id) {
      return res.status(400).send('Invalid user ID in the token');
    }

    const { user: { id } } = decodedToken;

    const info = await pool.query('SELECT active FROM user_info WHERE user_id = $1', [id]);

    if (info.rows[0].active !== true) {
      const updateQuery = 'UPDATE user_info SET active = true WHERE user_id = $1';
      await pool.query(updateQuery, [id]);
      return res.status(200).send('Confirmed account');
    } else {
      return res.status(400).send('Account already confirmed');
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send('Oops, an error occurred');
  }
};

const resendConfirmation = async (req, res) => {
  try {
    const id = req.user.id;
    const info = await pool.query('SELECT email, active FROM user_info WHERE user_id = $1', [id]);
    if (info.rows.length > 0 && info.rows[0].active !== true) {
      await sendConfirmationEmail(id, info.rows[0].email);
    }
  } catch (err) {
    res.status(400).send('Oops, an error occurred');
  }
};

const signupCompany = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM user_info WHERE email = $1', [email]);
    const userType = await getUserTypeByName(ROLES.Employer);

    if (!userType) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const type = userType.rows[0];

    if (user.rows.length > 0) {
      return res.status(401).json('User already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      'INSERT INTO user_info (email, password, usertype_id) VALUES ($1, $2, $3) RETURNING *',
      [email, bcryptPassword, type.id]
    );

    const jwToken = jwtGenerator(newUser.rows[0].user_id, type.name);
    return res.json({ jwToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//refreshing accessToken (jwtToken)
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if(!refreshToken){
    return res.status(401).send('Acess Denied. No refresh token');
  }
  try{
    const decoded = jwt.verify(refreshToken, process.env.REF_SECRET);
    //either refreshToken should be verified- checking if its crct, in the case of jwttoken
    //or u have to query the db and look into users refreshtoken is same
   // const type = await pool.query('SELECT usertype_id FROM user_info WHERE user_id = $1', [decoded.user_id]);
    const type_result = await pool.query(`
    SELECT user_role.role
    FROM user_info
    JOIN user_role ON user_info.usertype_id = user_role.id
    WHERE user_info.user_id = $1`, [decoded.user_id]);
    if (type_result.rows.length > 0) {
      const role = type_result.rows[0].role;
      const accessToken = jwtGenerator(decoded.user_id, role);//jwt.sign({user: decoded.user}, process.env.jwtSecret, {expiresIn:'1h'});
      res.header('Authorization', accessToken).send(decoded.user);
    } else {
      return res.status(404).send('Invalid role');
    }
   
  }catch(err){
    return res.status(400).send('Invalid refresh token');
  }
}

//logout

//handle error - cannot get accesstoken
const redirect = async (req, res, next) => {
  try{
  //const accessToken = req.user.accessToken;
  //const accessJwt = tokenJwt(accessToken);
  //console.log(accessJwt);
  //res.send(200).json({accessJwt});
  //res.set('Authorization', `Bearer ${accessJwt}`);
  console.log(req.user.accessToken);
  res.redirect('http://localhost:5000/project/repo');
  //return res.status(200).send(accessJwt);
  
  }catch(err){
    return res.status(500).send('Internal Server Error');
  }
  //console.log(req.user);
  //console.log("accesstoken", req.user);
}


const test = async( req, res) =>{
  console.log("jwtcrct");
}

//const logout = async (req, res) => {
//  req.logout();
//}

module.exports = {
  signupStudent,
  signupCompany,
  resendConfirmation,
  confirmation,
  confirmResetToken,
  forgotPassword,
  test,
  redirect
  //logout
}