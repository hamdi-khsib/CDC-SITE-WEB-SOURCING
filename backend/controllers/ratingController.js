const Rating = require('../models/Rating')
const asyncHandler = require('express-async-handler')

const createRating = asyncHandler( async(req, res) => {
    const { buyerId, supplierId, rating, comment } = req.body;
   
    try {
        const newRating = new Rating({
            buyerId,
            supplierId,
            rating,
            comment,
        });

        await newRating.save();
        res.status(201).json({ message: 'Rating created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the rating' });
    }
})

module.exports = {
    createRating,
};