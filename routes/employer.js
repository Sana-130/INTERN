const express = require("express");
const router = express.Router();
const pool = require("../db");
const {authorize} = require("../middleware/authorize");
const multer = require("multer");
const {jwtGenerator} = require("../utils/TokenGenerator");
const bcrypt = require('bcrypt');
const validInfo = require("../middleware/validInfo");

//employer signup
router.post("/signup/employer",  async(req, res) =>{
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


//employer dashboard

module.exports = router;