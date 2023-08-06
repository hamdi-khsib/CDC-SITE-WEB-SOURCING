// ratings.js
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  }
},
{ timestamps: true }
);

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
