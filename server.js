const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Config .env
require('dotenv').config({ path: './config/config.env' });

//Connect Database
connectDB();

const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Config for development
if (process.env.PORT_ENV === 'development') {
  // enable cors for localhost:3000
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  // morgan give information about api request
  app.use(morgan('dev'));
}

// import routes
const authRouter = require('./routes/auth.route');

// routes
app.use('/api/', authRouter);

// handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  });
});

// listen server in PORT
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
