const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorize');
const {
    createCompany,
    editCompany,
    getByUser,
    getById,
    getAllCompany,
getNotVerified, getLength, search, deleteCompany} = require('../controllers/company.controller');
const passport = require('passport');

router.post('/create', passport.authenticate('jwt', { session: false }), createCompany);
router.get('/pageId', passport.authenticate('jwt', { session: false }), getAllCompany);
router.post('/company/edit', passport.authenticate('jwt', { session: false }), editCompany);
router.get('/page/:id', passport.authenticate('jwt', { session: false }), getById);
router.get('/pages', passport.authenticate('jwt', { session: false }), getByUser);
router.get('/all/not-verified', getNotVerified);
router.get('/company/length', getLength);
router.get('/company/search', search);

router.get('/company/delete/:id', passport.authenticate('jwt', { session: false }), deleteCompany);
// Add other company-related routes as needed

module.exports = router;