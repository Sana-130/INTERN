const { pool }= require('../db/db-service');
const CompanyModel = require('../models/company.model');
const internshipModel = require('../models/internship.model');
    // Call the addCompany method and pass the required parameters
    
const createCompany = async (req, res) => {
  try {  
    console.log(req.user.id);
    const { name, bio, location, link } = req.body;
    const result = await CompanyModel.addCompany({
      name,
      bio,
      location,
      link,
      userId: req.user.id // Assuming you have access to the user_id in req.user
    });

    return res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const editCompany = async (req, res) => {
  try {
    const {name, id , bio, location , link} = req.body;
    console.log(name, id , bio, location , link);
    const user_id = req.user.id;
    const edited = await CompanyModel.editCompany(user_id, name, bio, location, link, id);
    return res.status(200).json(edited);
  }catch(err){
    res.status(404).send("some error", err);
  }
};



const getByUser = async(req, res) => {
  try{
    const user_id = req.user.id;
    const data = await CompanyModel.getByUser(user_id);
    return res.status(200).json(data);
  }catch(err){
    res.status(400).send("some error", err);
  }
}

const getById = async(req, res)=>{
  try{
    const id = req.params.id;
    const data = await CompanyModel.getById(id);
    const interData = await internshipModel.getByCompany(data[0].id);
    return res.status(200).json({data : data, internships: interData});
  }catch(err){
    res.status(404).json(err);
  }
}

const getAllCompany = async(req, res) => {
  try{
    const id = req.user.id;
    const data = await CompanyModel.getIDComp(id);
    return res.status(200).json(data);
  }catch(err){
    console.log(err);
    return res.status(404).json(err);
  }
}

const deleteCompany = async(req, res) => {
  try{
    const id = req.params.id;
    const user_id = req.user.id;
    //check if internships exists for this company if yes no, if no
    const exists = await CompanyModel.checkExistsInternship(id);
    if(exists){
      return res.status(200).json({e: true});
    }else{
      const result = await CompanyModel.deleteCompany(user_id, id);
      return res.status(200).json({e: false});
    }
    //await CompanyModel.deleteCompany(req.user.id, id); 
  }catch(err){
    return res.status(400).send(err);
    console.log(err);
  }
}

const getNotVerified = async(req, res) => {
  try{
    const page = req.query.page;
    if(page >= 1){
      const offset =  (page - 1 ) * 10;
      const result = await CompanyModel.getNotVerified(offset);
      return res.status(200).json(result);
    }else{
      return res.status(400).json({error : "invalid page data"});
    }
    
  }catch(err){
    return res.status(400).json("nope", err);
  }
}

const getLength = async(req, res) => {
  try {
    const result = await CompanyModel.getLength();
    return res.status(200).json(result);
  }catch(err){
    res.status(400).json("nope", err);
  }
}

const search = async(req, res) => {
  try{
    const input = req.query.input;
    if(input!=''){
      const resu = input.toLowerCase();
      const result = await CompanyModel.search(resu);
      return res.status(200).json(result);
    }else{
      return res.status(200).json([]);
    }
    
  }catch(err){
    console.log(err);
    return res.status(400).json(err);
  }
}

const verify = async(req, res) => {
  try{
    const { id } = req.body;
    await CompanyModel.verify(id);
    return res.status(200).send("ok");
  }catch(err){
    console.log(err);
    return res.status(400).send("not ok");
  }
}


module.exports = {
    createCompany,
    editCompany,
    getByUser,
    getById,
    getAllCompany,
    getNotVerified,
    getLength,
    search,
    verify,
    deleteCompany
}
