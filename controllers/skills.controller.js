const skillsModel = require('../models/skills.model');
const apiUtils = require('../utils/OpenApiSkills');
const search = require('../utils/languages');
const Skills = require('../models/userSkills.model');
const ProjectSkill = require('../models/projectSkill.model')
const project = require('../models/project.model');
const InternshipSkill = require('../models/InternshipSkill.model');

apiUtils.authenticate();

/*router.get('/autocomplete', (req, res)=>{
    const userInput = req.query.input;
    apiUtils.search(userInput);
    console.log(userInput);
});*/

const LibSearch = async(req, res) =>{
    try{
        const userInput = req.query.input;
        const allItems = await apiUtils.search(userInput);
        res.json({ allItems });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getSkillId = async (skill_name, isLang) =>{
    try {
        let result = await skillsModel.getSkillIdByName(skill_name, isLang);
   
        if (!result.length) {
            //await skillsModel.addSkill(skill_name, isLang);
            result = await skillsModel.addSkill(skill_name, isLang);
            //const newSkill = await skillsModel.getSkillIdByName(skill_name, isLang);
            //return newSkill;
        }    
        return result;
    } catch (err) {
        console.log(err);
    }
}

const AddIdToScore = async (obj) => {

    const  skillNames = obj;
    const updatedSkillNames = [];
    if (!skillNames || typeof skillNames !== 'object' || Object.keys(skillNames).length === 0) {
        return undefined;
    }
    //console.log("objjj", obj);
    const names = Object.keys(skillNames);
    const skillsData = await skillsModel.getSkillsByArray(names);

    //console.log(arr);

    /*for (const key in skillNames) {
        console.log(key, skillNames[key]);
        if (Object.hasOwnProperty.call(skillNames, key)) {
            const entry = skillNames[key];
            const id = await getSkillId(key, true);
            updatedSkillNames.push({ id: id[0].id, score: skillNames[key] });
        }
    }*/

    for (const key in skillNames) {
        if (Object.hasOwnProperty.call(skillNames, key)) {
            //const entry = skillNames[key];
            const skillData = skillsData.find(skill => skill.name === key);
            if (skillData) {
                updatedSkillNames.push({ id: skillData.id, score: skillNames[key] });
            } else {
                const result  = await skillsModel.addSkill(key, true);
                updatedSkillNames.push({ id: result[0].id, score: skillNames[key] });
            }
        }
    }

    return updatedSkillNames;
}

function calculateScores(data) {
    
    if (!data || !Array.isArray(data)) {
        return {};
    }
    const result = {};

    data.forEach((entry, index) => {
        if (entry === null) {
            return;
        }
        const score = (((entry.lines / 1000) - (entry.cpScore / 100)) * 10).toFixed(2);
        result[entry.lang] = score;
    });

    return result;
}

const getIdFromArray = async(array_names) => {
    const id_array = [];
    for (const name of array_names) {
        const id = await getSkillId(name);
        id_array.push(id[0]);
    }
    return id_array;
}

const getSkillIds = async (req, res) => {
    const {skillNames} = req.body;
    if (!skillNames || typeof skillNames !== 'object' || Object.keys(skillNames).length === 0) {
        return res.status(400).send("no skills given");
    }
    const id_array = []
    const skillNamesArray = Object.keys(skillNames);
    for (const name of skillNamesArray) {
        const id = await getSkillId(name);
        id_array.push(id[0]);
    }
    return res.status(200).json({data: id_array});
}


const addUserSkill = async (req, res) => {
    const user_id = req.user.id;
    try{
        const { data , repoId }= req.body;
        const scores = calculateScores(data.data);
        console.log("scores", scores, req.user.id);
        const entries = await AddIdToScore(scores);
            await project.addProject(user_id, repoId);
            for (const entry of entries){
                await ProjectSkill.addSkill( repoId, entry.id, entry.score);
                await ProjectSkill.addScore(user_id, entry.id, entry.score);
            }
            res.status(200).send("okkk");
      
        
    }catch(err){
        console.log(err);
    }
}

const AddSkillToInternship = async(req, res) => {
    try{
    const { skills , internship_id} = req.body;
    console.log("skills", skills, "id", internship_id);
    const keys = [];
    for (const key of skills){
        keys.push(key.name);
    }
    const id_array = await skillsModel.getSkillsByArray(keys);

    for (const key of skills){
        const skillData = id_array.find(skill => skill.name === key.name);
        if(skillData){
            await InternshipSkill.addSkill(internship_id, skillData.id); 
        }else{
            const result = await getSkillId(key.name, key.isLang);
            await InternshipSkill.addSkill(internship_id, result[0].id);
        }
    }

    return res.status(200).send("ok");
    }catch(err){
        console.log(err);
    } 
}


//frameowrks, packages, ....
const AddLib = async (req, res) => {
    console.log("blahhh")
    try{
        const { skill , rating } = req.body;
        console.log(skill , rating);
        //const rating = Number(num);
        if(rating<=5  && rating>0 ){
            const numb = Number(rating).toFixed(2);
            const user_id  = req.user.id;
            const id = await getSkillId(skill, false);
            if(id){
                await ProjectSkill.addScore(user_id, id[0].id, numb);
            }
            res.status(200).json({id:id, name: skill});
        }
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

const test = async(req, res) => {

    const  { skillNames } = req.body;
    const updatedSkillNames = [];
    if (!skillNames || typeof skillNames !== 'object' || Object.keys(skillNames).length === 0) {
        return undefined;
    }
    //console.log("objjj", obj);
    const names = Object.keys(skillNames);
    const skillsData = await skillsModel.getSkillsByArray(names);
    //console.log(arr);

    /*for (const key in skillNames) {
        console.log(key, skillNames[key]);
        if (Object.hasOwnProperty.call(skillNames, key)) {
            const entry = skillNames[key];
            const id = await getSkillId(key, true);
            updatedSkillNames.push({ id: id[0].id, score: skillNames[key] });
        }
    }*/

    for (const key in skillNames) {
        if (Object.hasOwnProperty.call(skillNames, key)) {
            //const entry = skillNames[key];
            const skillData = skillsData.find(skill => skill.name === key);
            if (skillData) {
                updatedSkillNames.push({ id: skillData.id, score: skillNames[key] });
            } else {
                const result  = await skillsModel.addSkill(key, true);
                updatedSkillNames.push({ id: result[0].id, score: skillNames[key] });
            }
        }
    }
    console.log(updatedSkillNames);

    return updatedSkillNames;
}

const deleteProject = async(req, res) => {
    try{
        const id = req.params.id;
        //console.log(id, req.user.id);
        await skillsModel.deductScores(id);
        const result = await project.deleteProject(req.user.id, id);
        return res.status(200).json(result);
    }catch(err){
        console.log(err);
        return res.status(500).send(err);
    }
}

const SearchDb = async (req, res) => {
    try{
        const input = req.query.input;
        console.log(input);
        const skills = await skillsModel.searchDb([input]);
        return res.status(200).json(skills);
    }catch(err){
        return res.status(400).send(err);
    }  

}

const AddSkillToDB = async (req, res) => {
    try{
        const {name , isLang} = req.body;
        await skillsModel.addSkill(name, isLang);
        return res.status(200).send("ok");
    }catch(err){
        return res.status(400).send("not ok", err);
    }
}



module.exports = {LibSearch, getSkillId, addUserSkill, getSkillIds, AddSkillToInternship, AddLib, test, SearchDb, AddSkillToDB, deleteProject};


