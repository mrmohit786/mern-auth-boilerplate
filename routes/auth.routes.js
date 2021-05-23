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
  resetPasswordController,
  googleLoginController
} = 
require('../controllers/auth.controller.js');

// auth routes
router.post('/register', registerValidator, registerController);
router.post('/login', loginValidator, loginController);
router.post('/activation', activationController);
router.post('/googleLogin', googleLoginController);
router.put(
  '/password/reset',
  resetPasswordValidator,
  resetPasswordController
);
router.put(
  '/password/forget',
  forgotPasswordValidator,
  forgetPasswordController
);


module.exports = router;
