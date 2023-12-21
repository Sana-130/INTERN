const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorize');
const { signupStudent,
    signupCompany,
    resendConfirmation,
    confirmation,
    confirmResetToken,
     forgotPassword ,
    test} = require('../controllers/auth.controller');
const { loginRouteRateLimit } = require("../utils/rateLimiter");

router.post("/signup/student", signupStudent);
router.post("/signup/company", signupCompany);
router.patch('/forgot-password', forgotPassword);
router.get("/confirmation/:tokenId", confirmation);
router.get('/resendConfirmation', resendConfirmation);
router.post('/login', loginRouteRateLimit);
router.get('/test', authorize, test);

module.exports = router;