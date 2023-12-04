const express = require('express');
const router = express.Router();
const login_signupController = require('../controllers/login_signupController')
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/login',login_signupController.login_post);

router.post('/signup',login_signupController.signup_post);

router.get('/employees',requireAuth,login_signupController.employeeDetails);



module.exports = router;
