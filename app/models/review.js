const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  favorited: {
    type: Boolean,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Review', reviewSchema)
