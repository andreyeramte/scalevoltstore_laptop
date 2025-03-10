// server.js
const dotenv = require('dotenv');
dotenv.config(); // Load .env variables into process.env

const express = require('express');
const cors = require('cors');
const path = require('node:path');
// const { Pool } = require('pg');
const Stripe = require('stripe');
const productRoutes = require('./routes/productRoutes.js');

const { ENV } = require('./config/env.js');

// Initialize express app
const app = express();

console.log({ ENV });
// Stripe initialization
const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15', // or any version you need
});

// Use CORS to allow requests from your frontend domain
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust as needed

// Use JSON parsing middleware
app.use(express.json());

// Serve static images from 'public/images'
app.use('/images', express.static('public/images'));

// Mount product routes at /api/products
app.use('/api/products', productRoutes);

// Serve static files from the frontend's dist directory
// app.use(express.static(path.join(__dirname, 'dist')));

// PostgreSQL Pool
/*
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
 */

// Test the connection
/*
pool.query('SELECT NOW()', (err, dbRes) => {
  if (err) {
    console.error('Error testing DB connection:', err);
  } else {
    console.log('DB Connection test successful, current time:', dbRes.rows[0].now);
  }
});
 */

// ------------------- ROUTES ------------------- //

// 1) Carousel Slides
app.get('/api/carousel-slides', (req, res) => {
  const carouselSlides = [
    {
      image: '/images/slide1.jpg',
      title: 'Slide 1',
      description: 'Description for Slide 1',
    },
    {
      image: '/images/slide2.jpg',
      title: 'Slide 2',
      description: 'Description for Slide 2',
    },
    {
      image: '/images/slide3.jpg',
      title: 'Slide 3',
      description: 'Description for Slide 3',
    },
  ];
  res.json(carouselSlides);
});

// 2) Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/checkout-success',
      cancel_url: 'http://localhost:3000/checkout-cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'An error occurred during checkout session creation' });
  }
});

// 3) Init DB
app.get('/init-db', async (req, res) => {
  try {
    /*
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL
      );
    `);
     */
    res.send('Table "users" created (if it did not exist).');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating table.');
  }
});

module.exports = app;
