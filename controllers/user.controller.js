const { pool } = require('../db/db-service');
const userProfile = require('../models/userProfile.model');
const userSkillsModel = require('../models/userSkills.model');
const UserModel = require('../models/user.model');

const editProfile = async (req, res) =>{
    try{
        const id = req.user.id;
       const { about, institution_name, graduation_year, course_name, site_link, location, contact_mail, linkedin_profile_link  } = req.body;
       console.log(about, institution_name, graduation_year, course_name, site_link, location, contact_mail, linkedin_profile_link)
       await userProfile.updateProfile(id, about, institution_name, graduation_year, course_name, site_link, location, contact_mail, linkedin_profile_link );
        return res.status(200).json({message: 'updated profile'});
    }catch(err){
        return res.status(500).json({message : 'smthg wrong while editing profile'});
    }
}

const getProfileData = async (req, res) =>{
    try{
        const id = req.params.id;
        //const skilldata = await userSkillsModel.getSkillData(id);
        const profileData = await userProfile.getProfile(id);
        
        return res.status(200).json({profileData});
    }catch(err){
        res.status(500).send("some error");
    }
}

const getSkillStats = async(req, res) => {
    try{
        const id = req.params.id;
        const data = await userSkillsModel.getSkillDatas(id);
        return res.status(200).json(data);

    }catch(err){
        res.status(500).send("some error");
    }
}

const getProfile = async(req, res) => {
    try{
        const id = req.user.id;
        const data = await userProfile.getProfile(id);
        return res.status(200).json(data[0]);
    }catch(err){
        res.status(500).send("some error while retreieving profile data");
    }
}

const getUserEById = async(req, res) => {
    try{
        const { id } = req.body;
        console.log(id);
        const result = await UserModel.getUserEById(id);
        return res.status(200).json(result);
    }catch(err){
        console.log(err);
        return res.status(500).send(err);
    }
}

const getUserSById = async(req, res) => {
    try{
        const { id } = req.body;
        console.log(id);
        const result = await UserModel.getUserSById(id);
        return res.status(200).json(result);
    }catch(err){
        console.log(err);
        return res.status(500).send(err);
    }
}

const getByNameStudent = async(req, res) => {
    try{
        const input = req.query.input;
        const result = await UserModel.getStudentByName(input);
        return res.status(200).json(result);
    }catch(err){
        console.log(err);
        return res.status(500).send("error getting data");
    }
}

const getByNameEmployer = async(req, res) => {
    try{
        const input = req.query.input;
        const result = await UserModel.getEmployerByName(input);
        return res.status(200).json(result);
    }catch(err){
        console.log(err);
        return res.status(500).send("error getting data");
    }
}


const getInfo = async (projects, accessToken) => {
    try {
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          const response = await fetch(
            `https://api.github.com/repositories/${project.repo_id}`,
            {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const repoInfo = await response.json();
            // Add repository name to the project object
            project.repo_name = repoInfo.name;
          }
  
          // Fetch skills for the project
          const responseSkills = await fetch(
            `https://api.github.com/projects/${project.repo_id}/skills`,
            {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }
          );
          if (responseSkills.ok) {
            const skills = await responseSkills.json();
            // Map skills to the desired format
            project.skills = skills.map((skill) => ({
              score: skill.score,
              skill_name: skill.skill_name,
            }));
          }
  
          return project;
        })
      );
      return updatedProjects;
    } catch (error) {
      console.error("Error fetching repository info:", error);
      return projects; // Return original projects array if an error occurs
    }
  };
  
  const getProjectInfo = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userProfile.getProjectInfo(id);
      if (result.length > 0) {
        const accessToken = await UserModel.getAccessToken(req.user.id);
        const updatedProjects = await getInfo(result, accessToken);
        console.log(updatedProjects);
        return res.status(200).json(updatedProjects);
      }
      return res.status(404).json({ message: "Projects not found" });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error getting data");
    }
  };

const getNotLangSkills = async(req, res) => {
        try{
            const id = req.user.id;
            const result = await userProfile.getNotLangSkills(id);
            return res.status(200).json(result);
        }catch(err){
            console.log(err);
            return res.status(500).send("error getting data");
        }
}

const deleteNotLangSkill = async(req, res) => {
    try{
        const id = req.user.id;
        const skill_id = req.params.id;
        const result = await userSkillsModel.deleteSkill(id, skill_id);
        return res.status(200).json(result);
    }catch(err){
        console.log(err);
        return res.status(500).send("error getting data");
    }
}

const editNames = async(req, res) => {
    try{
        const {first_name, last_name } = req.body;
        const id = req.user.id;
        const result = UserModel.editNames(id, first_name, last_name);
        return res.status(200).send("ok");
    }catch(err){
        return res.status(500).send(err);
    }
   
}



module.exports = {
    editProfile,
    getProfileData,
    getProfile,
    getSkillStats,
    getByNameEmployer,
    getByNameStudent,
    getUserEById,
    getUserSById,
    getProjectInfo,
    getNotLangSkills,
    deleteNotLangSkill,
    editNames
}
