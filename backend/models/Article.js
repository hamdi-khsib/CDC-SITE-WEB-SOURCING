// ratings.js
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  name: {
    type: String,
    required: true,
  },
  description: {
      type: String,
  },
  products: {
      type: String,
      required: true,
  },
  prices: {
      type: Number,
      required: true,
  },
  delai: {
    type: Date
  }

},
{ timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
