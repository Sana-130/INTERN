const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorize');
const { signupStudent,
    signupCompany,
    resendConfirmation,
    confirmation,
    confirmResetToken,
    forgotPassword ,
    test,
    redirect} = require('../controllers/auth.controller');
const { loginRouteRateLimit } = require("../utils/rateLimiter");
const passport = require('passport');

router.post("/signup/student", signupStudent);
router.post("/signup/company", signupCompany);
router.patch('/forgot-password', forgotPassword);
router.get("/confirmation/:tokenId", confirmation);
router.get('/resendConfirmation', resendConfirmation);
router.post('/login', loginRouteRateLimit);
router.get('/test', authorize, test);
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate('github',
{ failureRedirect: '/login' }), //(req,res) => {
    //const accessToken = passport.instance.getState('accessToken');
    //console.log(accessToken);
redirect
);

module.exports = router;