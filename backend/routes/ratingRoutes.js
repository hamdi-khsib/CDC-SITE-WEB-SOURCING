const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const verifyJWTBuyer = require("../middleware/verifyJWTBuyer")

router.use(verifyJWTBuyer)

router.post('/rate-supplier', ratingController.createRating);

module.exports = router;
