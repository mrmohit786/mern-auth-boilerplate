const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Config .env
require('dotenv').config({ path: './config/config.env' });

//Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

if (process.env.PORT_ENV === 'development') {
  app.use(morgan('dev'));
}

// import and use routes
app.use('/api/', require('./routes/auth.routes'));

// handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'API is not defined for this route',
  });
});

// listen server in PORT: 5000
app.listen(process.env.PORT, () => console.log(`server listening on port ${process.env.PORT}`));
