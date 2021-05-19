const User = require('../models/auth.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { mailService } = require('../utils/services');

// custom error handler
const { errorHandler } = require('../helpers/dbErrorHandling');

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
    <h1>Please click on link to activate your ${'react-app'} account.</h1>
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
        error: `Internal server error`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: errorHandler(error),
    });
  }
};

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: 'Expired link, Signup again',
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
            return res.status(401).json({
              error: errorHandler(err),
            });
          } else {
            return res.status(201).json({
              data: user,
              message: 'Signup successfully',
            });
          }
        });
      }
    });
  } else {
    return res.status(500).json({
      error: 'Activation token not found',
    });
  }
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array().map(error => error.msg)[0];
    return res.status(422).json({ error });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: 'User with this email does not exist, Please Signup',
      });
    } else if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match',
      });
    } else {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { _id, name, email, role } = user;
      return res.status(200).json({
        data: {
          token,
          user: {
            id: _id,
            name,
            email,
            role,
          },
        },
        message: 'login successfully',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

exports.forgetPasswordController = async (req, res) => {};
