const dotenv = require('dotenv');
dotenv.config(); // Load .env variables into process.env

const ENV = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

module.exports = { ENV };