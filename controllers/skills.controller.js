const skillsModel = require('../models/skills.model');
const apiUtils = require('../utils/OpenApiSkills');
const search = require('../utils/languages');


apiUtils.authenticate();

/*router.get('/autocomplete', (req, res)=>{
    const userInput = req.query.input;
    apiUtils.search(userInput);
    console.log(userInput);
});*/

const LibSearch = async(req, res) =>{
    try{
        const userInput = req.query.input;
        console.log(userInput);
        const allItems = await apiUtils.search(userInput);
        res.json({ allItems });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getSkillId = async (req, res) =>{
    try{
        const { skill_name } = req.body;
        const result = await skillsModel.getSkillIdByName(skill_name);
        console.log(result);
        if(!result.length){
            return res.status(400).json({message: "no skill with the name found"});
        }
        return res.status(200).json({message: result});
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = {LibSearch, getSkillId};