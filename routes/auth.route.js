const express = require('express');
const router = express.Router();

// Validations

const {
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
} = require('../helpers/validator');

const {
  registerController,
  activationController,
} = require('../controllers/auth.controller.js');

router.post('/register', registerValidator, registerController);
router.post('/activation', activationController);

module.exports = router;
