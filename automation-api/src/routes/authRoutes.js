const express = require('express')
const { register, login } = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validation');

const router = express.Router();
router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)

module.exports = router