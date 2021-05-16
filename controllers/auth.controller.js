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
      return res.status(200).json({
        message: `Email has been sent to ${email}`,
      });
    } else {
      return res.status(500).json({
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

// Account activation
exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          success: false,
          errors: 'Expired link. Signup again',
        });
      } else {
        const { name, email, password } = jwt.decode(token);

        const user = new User({
          name,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            console.log('Save error', errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.status(201).json({
              success: true,
              data: user,
              message: 'Signup success',
            });
          }
        });
      }
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again',
      errors: 'token not found',
    });
  }
};
