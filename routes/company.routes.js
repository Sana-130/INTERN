const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorize');
const {
    createCompany,
    editCompany,
    getCompanyById} = require('../controllers/company.controller');

router.post('/create', authorize, createCompany);
router.put('/:companyId/edit', authorize, editCompany);
router.get('/:companyId', getCompanyById);

// Add other company-related routes as needed

module.exports = router;