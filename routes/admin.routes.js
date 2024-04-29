const express = require('express');
const router = express.Router();
const {getByNameEmployer, getByNameStudent, getUserEById, getUserSById} = require('../controllers/user.controller');
const { verify } = require('../controllers/company.controller');
const  { authorize }= require('../middleware/authorize');
const passport = require('passport');

//router.get('/skillstats', getProfileData);
router.get('/search/emp', getByNameEmployer);
router.get('/search/student', getByNameStudent);
router.post('/search/emp/id', getUserEById);
router.post('/search/student/id', getUserSById);
router.post('/company/verify', verify);
//router.post('/profile/edit', profileValidation, editProfile);


module.exports = router;