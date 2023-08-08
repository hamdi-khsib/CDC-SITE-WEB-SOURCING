const Rating = require('../models/Rating')
const asyncHandler = require('express-async-handler')

const createRating = asyncHandler( async(req, res) => {

    if (!req.buyerId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { supplierId, rating, comment } = req.body;
    const buyerId = req.buyerId;
    console.log(req.buyerId)

    
   
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
        console.log(error)
        res.status(500).json({ error: 'An error occurred while creating the rating' });
    }
})

module.exports = {
    createRating,
};