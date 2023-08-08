const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');


router.get('/generate-report', reportController.generateReport);

module.exports = router;