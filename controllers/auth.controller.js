const User = require('../models/auth.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { mailService } = require('../utils/services');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const { errorHandler } = require('../helpers/dbErrorHandling');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

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
      return res.status(200).json({
        message: `Email has been sent to ${email}`,
      });
    } else {
      return res.status(500).json({
        error: `Internal server error`,
      });
    }
  } catch (error) {
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
          authorizationId: uuidv4(),
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

exports.forgetPasswordController = async (req, res) => {
  const { email } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array().map(error => error.msg)[0];
    return res.status(422).json({ error });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: 'email does not exists',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: '10m' }
    );

    //email data sending
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset password link',
      html: `
        <h1>Please click on link to reset your ${'react-app'} password.</h1>
        <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
        <hr/>
        <p>This email contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
    };

    user = await user.updateOne({
      resetPasswordLink: token,
    });

    if (user) {
      const request = await mailService(mailOptions);
      if (request) {
        return res.status(200).json({
          message: `Email has been sent to ${email}`,
        });
      } else {
        return res.status(500).json({
          error: `Something went wrong, Please try again`,
        });
      }
    } else {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

exports.resetPasswordController = (req, res) => {
  const { password, resetPasswordLink } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      error: error,
    });
  }

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, decoded) => {
        if (err) {
          return res.status(400).json({
            error: 'Expired Link, try again',
          });
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'Something went wrong, Please Try again later.',
            });
          }

          const updatedPassword = {
            password,
            resetPasswordLink: '',
          };

          user = _.extend(user, updatedPassword);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: 'Error in resetting user password',
              });
            }
            res.status(200).json({
              message: 'Password is updated',
            });
          });
        });
      }
    );
  } else {
    res.status(400).json({
      error: 'Reset password link is not found',
    });
  }
};

exports.googleController = (req, res) => {
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const { idToken } = req.body;
  client
    .verifyIdToken({ idToken, audience: process.env.CLIENT_ID })
    .then(response => {
      const { email_verified, name, email, picture, sub } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d',
            });
            const { _id, email, name, role } = user;
            return res.status(200).json({
              data: {
                token,
                user: { id: _id, email, name, role },
              },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({
              name,
              email,
              password,
              imageUrl: picture,
              authorizationId: sub,
              authorizationType: 'GOOGLE',
            });
            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: 'User signup failed with google',
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, name, role } = data;
              return res.status(200).json({
                data: {
                  token,
                  user: { id: _id, email, name, role },
                },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again',
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: 'Internal server error',
      });
    });
};

// not working
exports.facebookController = (req, res) => {
  const { userID, accessToken } = req.body;
  const url = `https://graph.facebook.com/v10.0/${userID}?access_token=${accessToken}`;

  return fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
          });
          const { _id, email, name, role } = user;
          return res.status(200).json({
            data: {
              token,
              user: { id: _id, email, name, role },
            },
          });
        } else {
          let password = email + process.env.JWT_SECRET;
          user = new User({ name, email, password });
          user.save((err, data) => {
            if (err) {
              return res.status(400).json({
                error: 'User signup failed with facebook',
              });
            }
            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
              expiresIn: '7d',
            });
            const { _id, email, name, role } = data;
            return res.status(200).json({
              data: {
                token,
                user: { id: _id, email, name, role },
              },
            });
          });
        }
      });
    })
    .catch(error => {
      res.status(400).json({
        error: 'Facebook login failed. Try later',
      });
    });
};
