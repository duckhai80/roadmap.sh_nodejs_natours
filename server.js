const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE_REMOTE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DATABASE, {}).then(() => {
  console.log('Database connect successful!');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on the ${PORT}.`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection! 💥 Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
