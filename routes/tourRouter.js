const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRouter');
const { cacheAPI } = require('../cache/cacheService');

const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.get5CheapTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('user', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

// tours-within/233/center/-40,45/unit/mi
// tours-within?distance=233&center=-40,45&unit=mi
router
  .route('/tours-within/:distance/center/:latlong/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlong/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(cacheAPI('tour'), tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(cacheAPI('tour'), tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('guide', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('guide', 'lead-guide'),
    tourController.deleteTour,
  );

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
