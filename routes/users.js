const express = require('express');
const router = express.Router();
const {verify, verifyAdmin} = require('../auth');
const userControllers = require('../controllers/users');

// 1) Register User
router.post('/register', userControllers.registerUser);

// 2) Login User
router.post('/login', userControllers.loginUser);

// 3) Get All Users
router.get('/', verify, verifyAdmin, userControllers.getAllUsers);

// 4) Get User Profile
router.get('/details',verify, userControllers.getUserProfile);

// 5) Reset Password
router.patch('/update-password', verify, userControllers.resetPassword);

// 6) Set User as Admin
router.patch('/:userId/set-as-admin', verify, verifyAdmin, userControllers.setAsAdmin);


module.exports = router;