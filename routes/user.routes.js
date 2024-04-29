const express = require('express');
const router = express.Router();
const {editProfile, getProfileData, getProfile, getSkillStats, getProjectInfo, getNotLangSkills, deleteNotLangSkill, editNames} = require('../controllers/user.controller');
const { profileValidation } = require('../utils/validations');
const  { authorize }= require('../middleware/authorize');
const passport = require('passport');

//router.get('/skillstats', getProfileData);
router.get('/profile/:id', passport.authenticate('jwt', { session: false }), getProfileData);
router.get('/skills/get', passport.authenticate('jwt', { session: false }), getNotLangSkills);
router.get('/projects/:id',passport.authenticate('jwt', { session: false }), getProjectInfo);
router.post('/profile/edit' , passport.authenticate('jwt', { session: false }), editProfile);
router.get('/profile/getInfo', passport.authenticate('jwt', { session: false }), getProfile);
router.get('/:id/stats', passport.authenticate('jwt', { session: false }), getSkillStats);

router.get('/skill/delete/:id',passport.authenticate('jwt', { session: false }), deleteNotLangSkill);
//router.post('/profile/edit', profileValidation, editProfile);

router.post('/edit/names', passport.authenticate('jwt', { session: false }), editNames);


module.exports = router;