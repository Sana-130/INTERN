const express = require('express');
const router = express.Router();
const passport = require('passport');
const { githubAuthorize } = require('../middleware/authorize');

const {redirect, getRepo, repoAnalyse, addProject} = require('../controllers/repo.controller');

router.get('/repo', passport.authenticate('jwt', { session: false }), githubAuthorize, getRepo);
router.get('/add', addProject);
router.get('/delete');
//router.post('/add/skill');


module.exports = router;