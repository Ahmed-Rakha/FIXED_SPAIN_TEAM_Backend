// server.js
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = require('./app');
const mongoose = require('mongoose');

// Connect to MongoDB
const DB = process.env.DB_URL;
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
const start = async () => {
  try {
    await mongoose.connect(DB);
    console.log('DB connection successful!');
    // Add your server code here
    app.listen(PORT, () => {
      console.log(`App listening at PORT ${PORT}`);
    });
  } catch (error) {
    console.log('Error connecting to DB', error);
  }
};

start();
