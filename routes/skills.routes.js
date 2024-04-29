const express = require('express');
const router = express.Router();
const search = require('../utils/languages');
const passport = require('passport');

const {LibSearch, LangSearch, getSkillId, addUserSkill, getSkillIds, AddSkillToInternship, AddLib, test, SearchDb, AddSkillToDB, deleteProject} = require('../controllers/skills.controller');


router.get('/search/lib', LibSearch);
router.get('/search/lang', search);
router.post('/id', getSkillId);
router.post('/add', passport.authenticate('jwt', { session: false }), addUserSkill);
router.post('/calculate');
router.post('/internship/add', AddSkillToInternship);
router.post('/add/lib', passport.authenticate('jwt', { session: false }), AddLib);
router.post('/testing', test);

router.get('/search/db', SearchDb);
router.post('/add/db', AddSkillToDB);

router.get('/projects/delete/:id', passport.authenticate('jwt', { session: false }), deleteProject);

module.exports = router;