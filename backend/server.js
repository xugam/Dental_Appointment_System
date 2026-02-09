const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const app = express();

const PORT = process.env.PORT||5000;

connectDB();

app.use(express.json());
app.use('/dental', require('./routes/dentalroute'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
