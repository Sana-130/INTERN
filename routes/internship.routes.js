const express = require('express');
const router = express.Router();

const { authorize } = require('../middleware/authorize');
const {addInternship,
      editInternship,
      getInternshipById,
      getAllInternshipsByCompany,
      getInternshipApplicants } = require('../controllers/internship.controller');

router.post('/add', authorize, addInternship);
router.put('/:internPostId/edit', authorize, editInternship);
router.get('/:internPostId', getInternshipById);
router.get('/:companyId/all', getAllInternshipsByCompany);
router.get('/:internPostId/applicants', getInternshipApplicants);


// Add other internship-related routes as needed

module.exports = router;