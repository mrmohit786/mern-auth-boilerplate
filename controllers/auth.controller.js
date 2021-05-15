const User = require('../models/auth.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { mailService } = require('../utils/services');

// custom error handler
const { errorHandler } = require('../helpers/dbErrorHandling');

// register controller
exports.registerController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array().map(error => error.msg)[0];
      return res.status(422).json({
        error: error,
      });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          error: 'Email is already exists',
        });
      }
    }

    //Generate jwt token
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '15m' }
    );

    //email data sending
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
    <h1>Please click to link to activate</h1>
    <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
    <hr/>
    <p>This email contain sensitive information</p>
    <p>${process.env.CLIENT_URL}</p>
    `,
    };

    // send activation mail
    const request = await mailService(mailOptions);
    if (request) {
      console.log(request);
      return res.json({
        message: `Email has been sent to ${email}`,
      });
    } else {
      return res.json({
        message: `Internal server error`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      errors: errorHandler(error),
    });
  }
};
