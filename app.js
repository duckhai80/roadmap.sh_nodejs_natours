const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on the ${PORT}.`);
});

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from the server',
//     app: 'Natours',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('Post successfully!');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

console.log(tours);
