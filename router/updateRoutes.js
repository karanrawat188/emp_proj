const express = require('express');
const router = express.Router();
const {bulkUpdateOrInsertEmployees} = require('../controllers/upsertController')
const { requireAuth } = require('../middleware/authMiddleware');

router.put('/', requireAuth,bulkUpdateOrInsertEmployees);

module.exports = router;