const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { setCache } = require('../cache/cacheService');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow to nested GET reviews on tour
    const filterObject = {};

    if (req.params.tourId) filterObject.tour = req.params.tourId;

    const modelFeatures = await new APIFeatures(
      Model.find(filterObject),
      req.query,
    )
      .filter()
      .sort()
      .limit()
      .paginate();

    // const doc = await modelFeatures.query.explain();
    const doc = await modelFeatures.query;
    const dataResponse = {
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    };

    // Set cache
    if (req.prefixKey) {
      await setCache(
        `${req.prefixKey}:${req.originalUrl}`,
        JSON.stringify(dataResponse),
      );
    }

    res.status(200).json(dataResponse);
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);

    if (query && populateOptions) query = query.populate(populateOptions);

    const doc = await query;
    const dataResponse = {
      status: 'success',
      data: {
        data: doc,
      },
    };

    // Set cache
    if (req.prefixKey) {
      await setCache(
        `${req.prefixKey}:${req.originalUrl}`,
        JSON.stringify(dataResponse),
      );
    }

    res.status(200).json(dataResponse);
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
