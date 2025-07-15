const express = require('express');
const router = express.Router();
const {verify, verifyAdmin} = require('../auth');
const userControllers = require('../controllers/users');

// Register User
router.post('/register', userControllers.registerUser);
// Login User
router.post('/login', userControllers.loginUser);

module.exports = router;