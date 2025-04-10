const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
      trim: true,
      maxLength: 100,
    },
    rating: {
      type: Number,
      required: [true, 'REQUIRE'],
      max: [5, 'Rating must be below 5.0!'],
      min: [1, 'Rating must be above 1.0!'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must be belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be belong to a user.'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
