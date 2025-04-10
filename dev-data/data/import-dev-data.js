const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: 'config.env' });

const DATABASE = process.env.DATABASE_REMOTE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DATABASE).then(() => {
  console.log('Connect database successful!');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

switch (process.argv[2]) {
  case '--import-data':
    importData();
    break;
  case '--delete-data':
    deleteData();
    break;
  default:
    break;
}

console.log(process.argv);
