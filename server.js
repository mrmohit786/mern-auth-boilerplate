const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config({ path: './config/config.env' });
const app = express();

app.use(bodyParser());
app.use(cors());

const PORT = process.env.PORT;

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

const authRouter = require('./routes/auth.route');

app.use('/api/', authRouter);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  });
});

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
