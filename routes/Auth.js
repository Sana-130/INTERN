const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const {authorize, roleAccessMiddleware} = require("../middleware/authorize");
const validInfo = require("../middleware/validInfo");
const passport = require('passport');
const  ROLES  = require('../utils/roles');


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
        //res.status(500).send("Server error");
    }
}

//register student
router.post("/signup/student", validInfo, async(req, res) =>{
    
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
        //insert data to student table
        const jwToken = jwtGenerator(newUser.rows[0].user_id, type.name);
        return res.json({jwToken});
        
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

//register company
router.post("/signup/company", validInfo, async(req, res) =>{
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

//login
router.post('/login',  function(req, res, next) {
    passport.authenticate('local', {session : false}, (err, user, info) =>{
        //console.log(err);
        if(err || !user){
            return res.status(400).json({
                message: info ? info.message: 'Login Failed',
                user : user
            })
        }
    
        req.login(user, {session: false}, (err) =>{
            if(err){
                res.send(err);
            }
            try {
                //console.log("id", req.user.user_id);
                const jwtToken = jwtGenerator(req.user.user_id, req.user.role);
                res.json({ token: jwtToken });
              } catch (err) {
                res.status(500).json({ error: 'Internal Server Error' });
              }
        });
    })(req, res, next);
});


router.get('/sar', passport.authenticate('jwt', { session: false }),
roleAccessMiddleware(ROLES.Student),
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


router.post("/verify", authorize, (req, res) =>{
    try{
        res.json(true);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;