const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const {authorize} = require("../middleware/authorize");

//create the company profile
router.post("/profile", async(req, res)=>{
    try{
    const {name, location, date, description} = req.body;
    if(!name || !location || !date || !description){
        return res.status(400).json({error : 'Missing required fields'});
    }
    let newPage = await pool.query("INSERT INTO Company (Company_name, description ,location, established_date, createdBy) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, location, date, ]);
    return res.status(200).json({newPage});
    }catch(err){
        res.status(500).send("Server error");
    }
});


router.get("/profile/edit", async(req, res)=>{
    try{
        let Page = await pool.query("SELECT * FROM Company WHERE createdBy = $1", [])
        if(Page.rows.length == 0){
            return res.status(401).json("no page exists!");
        }
        return res.status(200).json(Page.rows[0]);
    }catch(err){
        res.status(500).send("Server error");
    }
})



//create a internship post - if there's a company, by default the company name should be given in the job field. 


router.post("/posting", authorize, async(req, res) =>{
    const {email, name, password } = req.body;

});

module.exports = router;