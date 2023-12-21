const express = require("express");
const router = express.Router();
const pool = require("../db");
const {authorize} = require("../middleware/authorize");
const apiUtils = require('../utils/SkillsApi');
const profileValidation = require('../utils/validations');
const validationMiddleware = require('../middleware/validInfo');

//apiUtils.authenticate();

router.get('/autocomplete', (req, res)=>{
    const userInput = req.query.input;
    apiUtils.search(userInput);
    console.log(userInput);
});

router.get('/profile', async(req, res)=>{
    try{

    }catch(err){

    }
    //retreive data from database.
})

router.post('/profile/edit', profileValidation, async(req, res)=>{
    try{
        //insert data into database.
    }catch(err){
        console.log(err);
    }
});

router.post('/:internPost/apply', async(req, res) => {
    try{
        //table with - user_Applicant table , internship_id, applicant_id
    }catch(err){
        console.log(err);
    }
})

//get all posts
router.get('/internships' , async(req, res) => {
    try{
        //retrieve all internships from database
    }catch(err){

    }
});

router.get('/internship/recommends', (req, res) => {
    try{
        //join skills from user<->skill association table and internship<->skill association table
    }catch(err){

    }
});

router.get('/internship/domain', (req, res) => {
    try{
        //get query from url
        //search db for posts where internship domain = qdomain
    }catch(err){

    }
})

router.get('/internship/nearme', (req, res) => {
    try{
        //apply near me 
        //store location as points
        //search by whose ascending order in the calculation where diff in coordinates are less
    }catch(err){
        
    }
})

module.exports = router;


//user signup

//user login

//user logout

//user dashboard - features available to all - view every internship, view every collab requests, view every events

//user profile