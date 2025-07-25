const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const { setCache, getCache } = require('../cache/cacheService');

exports.alertMessage = (req, res, next) => {
  const { alert } = req.query;

  switch (alert) {
    case 'booking':
      res.locals.alert =
        "Your booking was successful! Please check your email for a confirmation! If your booking doesn't show up here immediately, please come back later.";
      break;
    default:
      break;
  }

  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  // Get tour data from collection
  const tours = await Tour.find();
  const dataRender = {
    title: 'All tours',
    tours: tours,
  };

  // Set cache
  if (req.template) {
    await setCache(
      `${req.template}:${req.originalUrl}`,
      JSON.stringify(dataRender),
    );
  }

  // Render that template using tour data
  res.status(200).render(req.template, dataRender);
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Get data from requested tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  const dataRender = {
    title: `${tour.name} tour`,
    tour,
  };

  // Set cache
  if (req.template) {
    await setCache(
      `${req.template}:${req.originalUrl}`,
      JSON.stringify(dataRender),
    );
  }

  // Render template using tour data
  res.status(200).render(req.template, dataRender);
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async (req, res) => {
  // Find all bookings of the current user
  const bookings = await Booking.find({ user: req.user.id });

  // Find tours of the current ids in bookings
  const tourIds = bookings.map((booking) => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  const dataRender = {
    title: 'My tours',
    tours: tours,
  };

  // Set cache
  if (req.template) {
    await setCache(
      `${req.template}:${req.originalUrl}`,
      JSON.stringify(dataRender),
    );
  }

  res.status(200).render(req.template, dataRender);
});
