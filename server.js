const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE_REMOTE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name!'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price!'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const newTour = new Tour({
  name: 'The forest hiker',
  price: 297,
  rating: 4.7,
});

// newTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((error) => console.log(error));

mongoose.connect(DATABASE, {}).then(() => {
  console.log('Database connect successful!');
});

app.listen(PORT, () => {
  console.log(`Server is running on the ${PORT}.`);
});
