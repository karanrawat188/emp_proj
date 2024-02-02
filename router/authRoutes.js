const express = require('express');
const router = express.Router();
const login_signupController = require('../controllers/login_signupController')

router.post('/login',login_signupController.login_post);

router.post('/signup',login_signupController.signup_post);

router.get('/deletedlogs',login_signupController.deletedLogs);

module.exports = router;
