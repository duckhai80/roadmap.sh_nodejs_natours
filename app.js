const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRouter');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const bookingRouter = require('./routes/bookingRouter');
const { createSwaggerDocument } = require('./docs/swagger');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//  1. MIDDLEWARE
// Implement CORS
app.use(cors());
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set HTTP secure headers
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

// Develop tracking loggers request
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

// Handle webhook checkout
// We put this route here because it need data as string value, not json value
// After we complete payment, Stripe will trigger webhook. Remember to deploy project successfully to get original url, after that handle webhook in Stripe webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

// Parse body, read data from body of req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

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

app.use(compression());

// Test middleware and set request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//  2.ROUTES
app.use('/', viewRouter);
app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs', (req, res, next) => {
  const swaggerDocument = createSwaggerDocument(req);
  const html = swaggerUi.generateHTML(swaggerDocument, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customSiteTitle: 'Natours API Documentation',
  });

  res.send(html);
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );

  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
