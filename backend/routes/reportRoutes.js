const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const verifyJWTBuyer = require("../middleware/verifyJWTBuyer")

router.use(verifyJWTBuyer)


router.get('/generate-report', reportController.generateReport);

module.exports = router;