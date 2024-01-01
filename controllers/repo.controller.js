const { Octokit } = require('@octokit/core');
const jwt = require('jsonwebtoken');  
const axios = require('axios');
const skillsModel = require('../models/skills.model');
const ProjectSkill = require('../models/projectSkill.model');

//return repo names
const getRepo = async (req, res) => {
  
    try{
      const accessToken = req.user.accessToken; //req.headers['authorization'];
      if(!accessToken){
        return res.status(401).json({message : 'Unauthorized : no token provided'});
      }
     // const octokit = new Octokit({ auth: accessToken });
      //const repoResponse = await octokit.request('GET /user/repos');
      const repoRes = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const apiUrl = `https://api.github.com/users/${req.user.username}/events/public`;

      const contrib = await axios.get(apiUrl, {
      headers: {
      'Authorization': `Bearer ${accessToken}`
      }
      });
      const contribDetails = contrib.data;
      const repoDetails = repoRes.data;
      /*const repoLanguages = {};
      for (const repo of repoDetails) {
        const languageResp = await octokit.request('GET /repos/:owner/:repo/languages',{
          owner : req.user.username,
          repo : repo.name
        });
       // console.log(languageResp);
        const languages = Object.keys(languageResp.data);
        repoLanguages[repo.name] = languages;
      }*/
      const repoNames = repoDetails.map(repo => repo.name);
      const repoDe = contribDetails.map(repo=> repo.type);
      //const languages = languagesResponse.data;
      return res.json({ repoNames, repoDe});//, languages });
    }catch(err){
      console.log(err);
      return res.status(500).json({message : 'smthg wrong with github api or acces token'})
    }
    
}

  //add project
  const addProject = async(req, res) => {
    try{
      const accessToken = req.user.accessToken;
      const repoName = req.body.repo;

      if(!accessToken){
        return res.status(401).json({message : 'Unauthorized : no token provided'});
      }
      if(!repoName){
        return res.status(404).send({message: 'select a valid repo'});
      }
      //check the existence and ownership
      const repoLink = `https://api.github.com/repos/${req.user.username}/${repoName}`;
      const repoResponse = await axios.get(repoLink, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      });
      const repoInfo = repoResponse.data;
      if (!repoInfo) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission for this repository' });
      }

      const languagesResp = await axios.get(`https://api.github.com/repos/${req.user.username}/${repoName}/languages`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        },
      });

      const languages = Object.keys(languagesResp.data);
      
      //const octokit = new Octokit({ auth: accessToken });
      //const lang = await octokit.request('GET /repos/:owner/:repo/languages',{
      //      owner : req.user.username,
      //      repo : repoName
      //});
      if(!lang){
        return res.status(404).send({message: 'some error occured'});
      }

    }catch(err){
      console.log(err);
    }
  }
  
  //should we add the languages even though we just need the api to retrieve the info(i think just store the libaries used).
  const repoAnalyse = async (req, res) => {
    //get the repo link
    //analyse the repo using the tool
    //for each langauge in the result, retrieve the skill id.
    //use regex to match the skill name from skills table
    //perform the equation and calculate a score.
    //check if there is a userid and skill id row if not add a row
    // add the score to it.
  }

  const addSkill = async (req, res) => {
    try{
        const { skill_name , projectId } = req.body;
        const result = await skillsModel.getSkillIdByName(skill_name);
        console.log(result);
        if(!result.length){
            return res.status(400).json({message: "no skill with the name found"});
        }
        const { id } = result[0];
        const re = ProjectSkill.addSkill(projectId, id, 0);

    }catch(err){

    }
  }

  module.exports = {
    getRepo,
    addProject,
    repoAnalyse
  }