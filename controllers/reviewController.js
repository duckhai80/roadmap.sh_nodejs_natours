const Review = require('../models/reviewModel');
const handlerFactory = require('../controllers/handlerFactory');
// const catchAsync = require('../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested route from Tour router
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
