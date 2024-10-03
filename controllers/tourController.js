const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    //  1.a. Filtering
    const queryObj = structuredClone(req.query);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((excludedField) => delete queryObj[excludedField]);

    //  1.b. Advance filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    //  2. Query data
    let tourQuery = Tour.find(JSON.parse(queryString));

    //  3. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');

      tourQuery = tourQuery.sort(sortBy);
    } else {
      tourQuery = tourQuery.sort('-createdAt');
    }

    //  4. Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');

      tourQuery = tourQuery.select(fields);
    } else {
      tourQuery = tourQuery.select('-__v');
    }

    const tours = await tourQuery;

    res.status(200).json({
      status: 'success',
      length: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({ _id: req.params.id });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    // const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
