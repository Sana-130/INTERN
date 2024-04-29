// controllers/internshipController.js
const { pool } = require('../db/db-service');
const internshipModel = require('../models/internship.model');
const internship_skill_model = require('../models/InternshipSkill.model');

const addInternship = async (req, res) => {
  //const { title, description, company_id, last_date, unpaid, min_salary, max_salary, is_active } = req.body;
  try { 
    console.log(req.body);
    const { title, description, company_id, last_date, min_salary, max_salary} = req.body;
    console.log("backend", title, description, company_id, last_date, min_salary, max_salary);
    const result = await internshipModel.addInternship(title, description, company_id, last_date, min_salary, max_salary );

      res.status(201).json(result);
  } catch (error) {
      console.error('Error in addInternship controller', error);
      res.status(500).json({ success: false, message: 'Failed to add internship' });
  }
};

const getInternShips = async(req, res) => {
  try {
   const internships = await internshipModel.getInternships();
    return res.status(200).json(internships);
      
  }catch(error) {
    console.log(error);
  return res.status(500).send("some error happend");
    // Handle the error
  }
}

const getById = async(req, res) => {
  try{
    const id  = req.params.id;
  const internship = await internshipModel.getInternshipById(id);
    console.log(internship[0]);
  return res.status(200).json(internship[0]);
  }catch(err){
    return res.status(500).send("some error happend");
  }
  

}

const Apply = async(req, res) => {
  try{
    const { id } = req.body;
    const result = await internshipModel.apply(id, req.user.id);
    return res.status(200).send("okk");
  }catch(err){
    return res.status(500).send("some error happend");
  }
}

const getApplied = async(req, res) => {

  try{
    const id = req.user.id;
    const result = await internshipModel.getApplied(id);
    return res.status(200).json(result);

  }catch(err){
    return res.status(500).send("some error happend");
  }
}

const matchSkill = async(req, res) => {
  try{
    const id = req.user.id;
    const data = await internshipModel.matchSkill(id);
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).send("some error happend");
  }
}

const getAppliedDetails = async(req, res) => {
  try{
    const id = req.params.id;
    const data = await internshipModel.getAppliedDetails(id);
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).send(err);
  }
}

const InternShipUser = async(req, res) => {
  try{
  const id = req.user.id;
  const data = await internshipModel.internshipEmp(id);
  return res.status(200).json(data);
  }catch(err){
    return res.status(500).send("some error happend");
  }
}

const editInternship = async (req, res) => {
  try {
  const { id , title, description, company_id, last_date, min_salary, max_salary} = req.body;
console.log(id , title, description, company_id, last_date, min_salary, max_salary);
  const result = await internshipModel.updateInternship(id , title, description, company_id, last_date, min_salary, max_salary);
  return res.status(200).json(result);
    // Implement your logic for editing an internship
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getInternshipById = async (req, res) => {
  try {
    const postId = req.params.internPostId;
    const post = await pool.query('SELECT * FROM Internships WHERE id = $1', [postId]);
    res.status(200).json({ success: true, post: post.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getAllInternshipsByCompany = async (req, res) => {
  try {
    const compId = req.params.companyId;
    const internships = await pool.query('SELECT * FROM Internships WHERE company_id = $1', [compId]);
    res.status(200).json({ success: true, internships: internships.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getInternshipApplicants = async(req, res) => {
  try {
    const postId = req.params.internPostId;
    // Implement your logic to get applicants for a specific internship
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const deleteInternshipSkill = async(req, res) => {
  try{
      const { internship_id, skill_id } = req.body;
      await internship_skill_model.deleteSkill(internship_id, skill_id);
      //const exist = await internshipModel.checkExists(user_id, internship_id);
      return res.status(200).send("okk");
  }catch(err){
    console.log(err);
    res.status(500).json(err);
  }
}

const deleteInternship = async(req, res) => {
  try{
    const id = req.params.id;
    await internshipModel.deleteInternship(id);
    return res.status(200).send("ok");
  }catch(err){
    return res.status(404).send(err);
  }
}

const sortApplicants = async( req, res) => {
  try{
    const {internship_id, skill_ids} = req.body;
    if(skill_ids.length==0){
      return res.status(400).send("nothing selected");
    }else{
      const result = await internshipModel.sortApplicants(internship_id, skill_ids);
      return res.status(200).json(result);
    }
  }catch(err){
    console.log(err);
  }

}

const filterApplicants = async(req, res) => {
  try{
    const id = req.params.id;
    const filter = req.query.filter;
    if (filter !== 'p' && filter !== 's' && filter !== 'r') {
      return res.status(404).json({ error: 'Invalid filter' });
    }

    const result = await internshipModel.filterInternships(id, filter);
    return res.status(200).json(result);
  }catch(err){
    return res.status(404).json(err);
  }
}

const approveApplication = async(req, res) => {
  try{
    const {internship_id, user_id}  = req.body;
    const result = await internshipModel.approveApplication(internship_id, user_id);
    res.status(200).json(result);
  }catch(err){
    return res.status(400).send(err);
  }
}

const rejectApplication = async(req, res) => {
  try{
    const {internship_id, user_id}  = req.body;
    const result = await internshipModel.rejectApplication(internship_id, user_id);
    res.status(200).json(result);
  }catch(err){
    return res.status(400).send(err);
  }
}

const pendingApplication = async(req, res) => {
  try{
    const {internship_id, user_id}  = req.body;
    const result = await internshipModel.pendingApplication(internship_id, user_id);
    res.status(200).json(result);
  }catch(err){
    return res.status(400).send(err);
  }
}

const getInternSkills = async(req, res) => {
  try{
    const id  = req.params.id;
    const result = await internshipModel.getInternSkills(id);
    return res.status(200).json(result);
  }catch(err){
    console.log(err);
    return res.status(400).send(err);

  }
}

const deleteISkill = async(req, res) => {
  try{
    const internship_id = req.params.internshipId;
    const skill_id = req.params.skillId;
    const result = await internship_skill_model.deleteSkill(internship_id, skill_id);
    return res.status(200).json(result);

  }catch(err){
    console.log(err);
    return res.status(400).send(err);
  }
}


// Add other internship-related actions as needed

module.exports= {
    addInternship,
    editInternship,
    getInternshipById,
    getAllInternshipsByCompany,
    getInternshipApplicants,
    getInternShips,
    getById,
    Apply,
    getApplied,
    matchSkill,
    InternShipUser,
    deleteInternshipSkill,
    deleteInternship,
    getAppliedDetails,
    sortApplicants,
    filterApplicants,
    approveApplication,
    rejectApplication,
    pendingApplication,
    getInternSkills,
    deleteISkill
}