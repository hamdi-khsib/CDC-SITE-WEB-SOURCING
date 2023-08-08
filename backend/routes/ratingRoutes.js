const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/rate-supplier', ratingController.createRating);

module.exports = router;
