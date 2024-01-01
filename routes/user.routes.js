const express = require('express');
const router = express.Router();
const {editProfile, getProfileData} = require('../controllers/user.controller');

router.get('/profile',getProfileData);
router.post('/profile/edit', editProfile);

module.exports = router;