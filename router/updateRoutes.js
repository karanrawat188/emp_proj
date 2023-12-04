const express = require('express');
const router = express.Router();
const upsertController = require('../controllers/upsertController')
const { requireAuth } = require('../middleware/authMiddleware');

router.put('/employee', requireAuth,upsertController.updateOrInsertEmployee);
router.put('/update-employee',requireAuth,upsertController.updateEmployee);

module.exports = router;