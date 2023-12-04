const express = require('express');
const router = express.Router();
const deleteController = require('../controllers/deleteController')
const { requireAuth } = require('../middleware/authMiddleware');

router.delete('/delete-employee',requireAuth,deleteController.deleteEmployee);
router.delete('/delete-manager',requireAuth,deleteController.deleteManager);
router.get('/delete-log',requireAuth,deleteController.deletedLogs);

module.exports = router;