const express = require('express');
const router = express.Router();
const search = require('../utils/languages');

const {LibSearch, LangSearch, getSkillId} = require('../controllers/skills.controller');

router.get('/search/lib', LibSearch);
router.get('/search/lang', search);
router.post('/id', getSkillId);


module.exports = router;