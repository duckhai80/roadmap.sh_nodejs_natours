const YAML = require('yamljs');
const path = require('path');

// Paths
const userPaths = YAML.load(path.join(__dirname, './paths/userPaths.yaml'));
const tourPaths = YAML.load(path.join(__dirname, './paths/tourPaths.yaml'));
const reviewPaths = YAML.load(path.join(__dirname, './paths/reviewPaths.yaml'));
const tourReviewPaths = YAML.load(
  path.join(__dirname, './paths/tourReviewPaths.yaml'),
);
const bookingPaths = YAML.load(
  path.join(__dirname, './paths/bookingPaths.yaml'),
);

// Schemas
const userSchemas = YAML.load(
  path.join(__dirname, './components/schemas/userSchemas.yaml'),
);
const tourSchemas = YAML.load(
  path.join(__dirname, './components/schemas/tourSchemas.yaml'),
);
const reviewSchemas = YAML.load(
  path.join(__dirname, './components/schemas/reviewSchemas.yaml'),
);
const bookingSchemas = YAML.load(
  path.join(__dirname, './components/schemas/bookingSchemas.yaml'),
);
const errorSchemas = YAML.load(
  path.join(__dirname, './components/schemas/errorSchemas.yaml'),
);

// Params
const params = YAML.load(path.join(__dirname, './components/params.yaml'));

// Responses
const userResponses = YAML.load(
  path.join(__dirname, './components/responses/userResponses.yaml'),
);
const tourResponses = YAML.load(
  path.join(__dirname, './components/responses/tourResponses.yaml'),
);
const reviewResponses = YAML.load(
  path.join(__dirname, './components/responses/reviewResponses.yaml'),
);
const bookingResponses = YAML.load(
  path.join(__dirname, './components/responses/bookingResponses.yaml'),
);
const errorResponses = YAML.load(
  path.join(__dirname, './components/responses/errorResponses.yaml'),
);

exports.createSwaggerDocument = (req) => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Natours API',
      version: '1.0.0',
      contact: {
        email: 'duckhai80@gmail.com',
      },
    },
    servers: [
      {
        url: `${req.protocol}://${req.get('host')}/api/v1`,
      },
    ],
    paths: {
      ...userPaths,
      ...tourPaths,
      ...reviewPaths,
      ...tourReviewPaths,
      ...bookingPaths,
    },
    components: {
      schemas: {
        ...userSchemas,
        ...tourSchemas,
        ...reviewSchemas,
        ...bookingSchemas,
        ...errorSchemas,
      },
      parameters: {
        ...params,
      },
      responses: {
        ...userResponses,
        ...tourResponses,
        ...reviewResponses,
        ...bookingResponses,
        ...errorResponses,
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };
};
