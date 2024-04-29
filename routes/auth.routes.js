const express = require('express');
const router = express.Router();
const { authorize , githubAuthorize } = require('../middleware/authorize');
const { signupStudent,
    signupEmp,
    resendConfirmation,
    confirmation,
    forgotPassword ,
    test,
    redirect, signupAdmin} = require('../controllers/auth.controller');
const { loginRouteRateLimit } = require("../utils/rateLimiter");
const passport = require('passport');
const { AccountValidation } = require('../utils/validations');


router.post("/signup/admin", AccountValidation, signupAdmin);
router.post("/signup/student", AccountValidation, signupStudent);
router.post("/signup/employer",signupEmp);
router.patch('/forgot-password', forgotPassword);
router.get("/confirmation/:tokenId", confirmation);
router.get('/resendConfirmation', resendConfirmation);
router.post('/login', loginRouteRateLimit);
router.get('/test', passport.authenticate('initial-login', { session: false }), test);
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate('github',
{ failureRedirect: '/login' }), 
redirect
);

router.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { 
        return next(err); 
        }
      res.redirect('/');
    });
  });

module.exports = router;