const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');

const app = express();

//  1. MIDDLEWARE
// Set HTTP secure headers
app.use(helmet());

// Develop tracking loggers request
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from the same request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP address. Please try again!',
});

app.use('/api', limiter);

// Parse body, read data from body of req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xssClean());

// Prevent parameter pollution
app.use(
  hpp({
    whiteList: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ],
  }),
);

// Serve static files
app.use(express.static(`${__dirname}/public`));

// Test middleware and set request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//  2.ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );

  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
