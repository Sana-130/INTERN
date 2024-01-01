// controllers/internshipController.js
const { pool } = require('../db/db-service');
const internshipModel = require('../models/internship.model');

const addInternship = async (req, res) => {
  //const { title, description, company_id, last_date, unpaid, min_salary, max_salary, is_active } = req.body;
  const updatedData = {};
  for (const field in req.body) {
    updatedData[field] = req.body[field] || null; // Set null for blank fields
  }

  try {
       
      updatedData.user_id = 1;//req.user.user_id;
      //find where compid and userid exists if yes add, if no errr
      // Call the addInternship method from the exported instance of your model
      console.log(updatedData);
      await internshipModel.addInternship(updatedData);

      // Send a success response
      res.status(201).json({ success: true, message: 'Internship added successfully' });
  } catch (error) {
      console.error('Error in addInternship controller', error);
      res.status(500).json({ success: false, message: 'Failed to add internship' });
  }
};

const editInternship = async (req, res) => {
  try {
    //const { name, description, lastDate, skills, unpaid, min_salary, max_salary, is_active } = req.body;
    const updatedData = {};
    updatedData.id = 2;
  for (const field in req.body) {
    updatedData[field] = req.body[field] || null; // Set null for blank fields
  }
  //console.log(updatedData);

  await internshipModel.updateInternship(updatedData);
  console.log("done successfully");
    // Implement your logic for editing an internship
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getInternshipById = async (req, res) => {
  try {
    const postId = req.params.internPostId;
    const post = await pool.query('SELECT * FROM Internship WHERE id = $1', [postId]);
    res.status(200).json({ success: true, post: post.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getAllInternshipsByCompany = async (req, res) => {
  try {
    const compId = req.params.companyId;
    const internships = await pool.query('SELECT * FROM Internship WHERE company_id = $1', [compId]);
    res.status(200).json({ success: true, internships: internships.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getInternshipApplicants = async (req, res) => {
  try {
    const postId = req.params.internPostId;
    // Implement your logic to get applicants for a specific internship
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Add other internship-related actions as needed

module.exports= {
    addInternship,
    editInternship,
    getInternshipById,
    getAllInternshipsByCompany,
    getInternshipApplicants
}