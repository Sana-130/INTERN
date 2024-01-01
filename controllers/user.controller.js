const { pool } = require('../db/db-service');
const userProfile = require('../models/userProfile.model');

const editProfile = async (req, res) =>{
    try{
       const {  userId, about, institutionName, currentYear, expGradYear, courseName } = req.body;
       console.log(userId, about, institutionName, currentYear, expGradYear, courseName)
       await userProfile.updateProfile({userId, about, institutionName, currentYear, expGradYear, courseName});
        console.log('updated successfully');
    }catch(err){
        return res.status(500).json({message : 'smthg wrong while editing profile'})
    }
}

const getProfileData = async (req, res) =>{
    try{
        
    }catch(err){

    }
}

const addProject = async (req, res) =>{
    try{
        
    }catch(err){

    }
}

const deleteProject = async (req, res) =>{
    try{

    }catch(err){

    }
}

const addSkills = async(req, res) =>{
    try{
        
    }catch(err){

    }
}

const editSkills = async(req, res) =>{
    try{

    }catch(err){

    }   
}

module.exports = {
    editProfile,
    getProfileData,

}
