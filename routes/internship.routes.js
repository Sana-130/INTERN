const express = require('express');
const router = express.Router();

const { authorize } = require('../middleware/authorize');
const {addInternship,
      editInternship,
      getInternshipById,
      getAllInternshipsByCompany,
      getInternshipApplicants, getInternShips , getById, Apply, getApplied, matchSkill, InternShipUser, 
      deleteInternshipSkill, deleteInternship, getAppliedDetails, sortApplicants, filterApplicants, rejectApplication, approveApplication, pendingApplication , getInternSkills, deleteISkill} = require('../controllers/internship.controller');
const passport = require('passport');


router.post('/add', addInternship);
router.get('/retrieve', getInternShips);
router.get('/retrieve/:id', getById);
router.post('/apply',  passport.authenticate('jwt', { session: false }), Apply);
router.get('/applied', passport.authenticate('jwt', { session: false }), getApplied);
router.get('/matched', passport.authenticate('jwt', { session: false }), matchSkill);
router.get('/view',  passport.authenticate('jwt', { session: false }), InternShipUser);

router.post('/sort', passport.authenticate('jwt', { session: false }), sortApplicants);
router.get('/:id/filter', passport.authenticate('jwt', { session: false }), filterApplicants);
router.get('/applied/:id', passport.authenticate('jwt', { session: false }), getAppliedDetails);

router.post('/applicants/accept', passport.authenticate('jwt', { session: false }), approveApplication);
router.post('/applicants/reject', passport.authenticate('jwt', { session: false }), rejectApplication);
router.post('/applicants/pending', passport.authenticate('jwt', { session: false }), pendingApplication);

router.post('/edit', passport.authenticate('jwt', { session: false }), editInternship);

router.get('/:internPostId', getInternshipById);
router.get('/:companyId/all', getAllInternshipsByCompany);
router.get('/:internPostId/applicants', getInternshipApplicants);
router.post('/edit/skills', passport.authenticate('jwt', { session: false }), deleteInternshipSkill);
router.get('/delete/:id', passport.authenticate('jwt', { session: false }), deleteInternship);

router.get('/skills/:id',  passport.authenticate('jwt', { session: false }), getInternSkills);
router.get('/delete/:internshipId/:skillId',  passport.authenticate('jwt', { session: false }), deleteISkill);


// Add other internship-related routes as needed

module.exports = router;