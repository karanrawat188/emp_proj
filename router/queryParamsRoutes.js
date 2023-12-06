const express = require('express');
const router = express.Router();
const queryParamsController = require('../controllers/queryParamsController')
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth,queryParamsController.queryRoutes);


module.exports = router;