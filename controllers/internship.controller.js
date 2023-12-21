// controllers/internshipController.js
const { pool } = require('../db/db-service');

const addInternship = async (req, res) => {
  try {
    const { name, description, lastDate, skills } = req.body;
    const post = await pool.query(
      'INSERT INTO Internships (postedBy_id, company_id, established_date, job_description, domain, skills, location, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.user.user_id, req.params.companyId, new Date(), description, 'domain', skills, 'location', true]
    );

    res.status(200).json({ success: true, message: 'Internship posted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const editInternship = async (req, res) => {
  try {
    const { name, description, lastDate, skills } = req.body;
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