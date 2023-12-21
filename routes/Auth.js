const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const {jwtGenerator} = require("../utils/TokenGenerator");
const {authorize, roleAccessMiddleware} = require("../middleware/authorize");
const validInfo = require("../middleware/validInfo");
const passport = require('passport');
const  ROLES  = require('../utils/roles');
const sendConfirmationEmail = require('../utils/emailService');
const jwt = require("jsonwebtoken");
const rateLimit = require('rate-limiter-flexible');
const { loginRouteRateLimit } = require("../utils/rateLimiter");

const getUserTypeByName = async(typeName) =>{
    try {
        const type = await pool.query("SELECT * FROM userType where role = $1", [
            typeName
        ]);
        if(type.rows.length===0){
            return false;
        }
        return type;
    }catch(err){
        console.log("error", err);
 
    }
}

//register student
router.post("/signup/student",  async(req, res) =>{
    
    try{
        const {email, name, password} = req.body;
        if(!email || !name || !password ){
            return res.status(400).json({error : 'Missing required fields'});
        }
        const userType = await getUserTypeByName(ROLES.Student);
        //return res.status(200).json({data: userType});
        if(!userType){
            return res.status(400).json({ error: 'Invalid user type' });
            //console.log(userType.rows[0].id);
        }
        const type = userType.rows[0];
        
        const user = await pool.query("SELECT * FROM user_info WHERE email = $1",[
            email
        ]);
        if(user.rows.length > 0){
            return res.status(401).json("User already exist!");
        }
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //insert data to user_info table
        let newUser = await pool.query(
            "INSERT INTO user_info (email, password, usertype_id) VALUES ($1, $2, $3) RETURNING *",
            [email, bcryptPassword, type.id]
        );
        //const et = emailToken(newUser.id);
        const userId = newUser.rows[0].user_id;
        await sendConfirmationEmail(userId, email);
        //THIS ONE - redirect to login page
        //const jwToken = jwtGenerator(newUser.rows[0].user_id, type.name);
        //return res.json({jwToken});
        return res.status(200).send("successfully signup");
        
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

router.patch('/forgot-password', async(req, res) => {
    const { email } = req.body;
    try{
        const user = await pool.query("SELECT * FROM user_info WHERE email = $1",[
            email
        ]);
        if(user.rows.length == 0){
            return res.status(401).json("User doesn't exist!");
        }
        const token = await pool.query("SELECT * FROM Token WHERE user_id = $1",[
            user.rows[0].user_id
        ]);
        

    }catch(err){

    }
})

//register company
router.get("/confirmation/:tokenId", async(req, res) => {
    try{
        console.log("heyy");
    const tokenId = req.params.tokenId;
    console.log(tokenId);
    const decodedToken = jwt.verify(tokenId, process.env.EMAIL_SECRET);
        console.log(decodedToken);
    if (!decodedToken || !decodedToken.user || !decodedToken.user.id) {
        return res.status(400).send("Invalid user ID in the token");
    }

    const { user: { id } } = decodedToken;
    
    const info = await pool.query("SELECT active FROM user_info WHERE user_id = $1",[
        id
    ]);
    
    if(info.rows[0].active!==true){
        //verify the jwt token
        const updateQuery = 'UPDATE user_info SET active = true WHERE user_id = $1';
        await pool.query(updateQuery, [id]);
        return res.status(200).send("confirmed account");
    }else{
        return res.status(400).send("already confirmed your account");
    }
    }catch(err){
        console.log(err);
        return res.status(400).send("oops there occured an error");
    }
});

router.get('/resendConfirmation', async(req, res) => {
    try{
    const id = req.user.id;
    const info = await pool.query("SELECT email, active FROM user_info WHERE user_id = $1",[
        id
    ]);
    if(info.rows.length > 0 && info.rows[0].active!==true){
        await sendConfirmationEmail(id, info.rows[0].email);
    }
    }catch(err){
        res.status(400).send("oops there occured an error");
    }
})


router.post("/signup/company", async(req, res) =>{
    const {email, name, password } = req.body;

    try{
        const user = await pool.query("SELECT * FROM user_info WHERE email = $1",[
            email
        ]);
        const userType = await getUserTypeByName(ROLES.Employer);
        //return res.status(200).json({data: userType});
        if(!userType){
            return res.status(400).json({ error: 'Invalid user type' });
            //console.log(userType.rows[0].id);
        }
        const type = userType.rows[0];

        if(user.rows.length > 0){
            return res.status(401).json("User already exist!");
        }
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);
        
        let newUser = await pool.query(
            "INSERT INTO user_info (email, password) VALUES ($1, $2, $3) RETURNING *",
            [email, bcryptPassword , type.id]
        );

        const jwToken = jwtGenerator(newUser.rows[0].user_id, type.name);
        return res.json({jwToken});
        
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }

});
//router.post('/login',  function(req, res, next) {
// passport.authenticate('local', {session : false}, async (err, user, info) =>{
//login
router.post('/login', loginRouteRateLimit);
/*router.post('/login',  function(req, res, next) {
     passport.authenticate('local', {session : false}, async (err, user, info) =>{    
        if(err || !user){
            if(info){
                console.log(info);
            }
            
            return res.status(400).json({
                message: info ? info.message: 'Login Failed',
                user : user
            })
        }
        
        req.login(user, {session: false}, async (err) =>{
            if(err){
                res.send(err);
            }
            if(info && info.status!==true){
                
                    try {
                      await emailRateLimiter.consume(req.user.user_id);
                    } catch (rlRejected) {
                      return res.status(429).json({ message: 'Too Many Requests' });
                    }
                  
                  // Apply rate limiting
                    // Send confirmation email
                    try {
                      //await sendConfirmationEmail(req.user.user_id, info.email);
                      return res.status(400).json({
                        message: 'User not confirmed. Confirmation email sent.'
                      });
                    } catch (emailError) {
                      return res.status(500).json({
                        message: 'Error sending confirmation email',
                        error: emailError,
                      });
                    }
            }
            try {
                const jwtToken = jwtGenerator(req.user.user_id, req.user.role);
                res.json({ token: jwtToken });
              } catch (err) {
                res.status(500).json({ error: 'Internal Server Error' });
              }
        });
    //loginRouteRateLimit(req, res, next);
})(req, res, next);
});*/


router.get('/test', passport.authenticate('jwt', { session: false }),
roleAccessMiddleware(ROLES.Employer),
(req,res) =>{
    return res.status(200).json({data:"acess granted"});
}
)

/*router.post("/login", validInfo, async(req, res) => {
    const { email , password , userTypeName} = req.body;

    try{
        const user = await pool.query("SELECT * FROM user_info WHERE email = $1", [
            email
        ]);
        
        if(user.rows.length == 0){
            return res.json(401).json("User doesnt exist");
        }
        const userType = await getUserTypeByName(userTypeName);
        //return res.status(200).json({data: userType});
        if(!userType){
            return res.status(400).json({ error: 'Invalid user type' });
            //console.log(userType.rows[0].id);
        }
        const type = userType.rows[0];
        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        )
        if(!validPassword){
            return res.status(401).json("Invalid Credentials");
        }
        const jwtToken = jwtGenerator(user.rows[0].user_id, type.name);
        return res.json({ jwtToken });

    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");

    }
});
*/

router.get('/confirmation/:token', async (req, res) => {
    try {
      const { user: { id } } = jwt.verify(req.params.token, EMAIL_SECRET);
      //await update user change active to true 
    } catch (e) {
      res.send('error');
    }
  
    return res.redirect('http://localhost:3001/login');
  });


router.post("/verify", authorize, (req, res) =>{
    try{
        res.json(true);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;