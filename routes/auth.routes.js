const router = require('express').Router();

// Validations
const {
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
} = require('../helpers/validator');

// controllers
const {
  registerController,
  activationController,
  loginController,
  forgetPasswordController,
} = 
require('../controllers/auth.controller.js');

// auth routes
router.post('/register', registerValidator, registerController);
router.post('/login', loginValidator, loginController);
router.post('/activation', activationController);
router.post(
  '/password/forget',
  forgotPasswordValidator,
  forgetPasswordController
);

module.exports = router;
