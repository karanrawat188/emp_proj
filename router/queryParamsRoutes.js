const express = require('express');
const router = express.Router();
const queryParamsController = require('../controllers/queryParamsController')
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/name-starts-with', requireAuth,queryParamsController.nameStartsWith);
router.get('/salary-greater-than',requireAuth,queryParamsController.greaterThansalaryFilterParam);
router.get('/get-user-detail',requireAuth,queryParamsController.fetchUserByIDParam);

module.exports = router;