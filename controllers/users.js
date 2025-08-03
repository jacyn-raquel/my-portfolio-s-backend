const bcrypt = require('bcrypt');
const User = require('../models/User');
const {createAccessToken, errorHandler} = require('../auth');

// 1) Register User 
module.exports.registerUser = async (req,res) => {
	const {firstName, lastName, email, password} = req.body;

	if(!email.includes("@") || password.length < 8){
		return res.status(400).json({
			message: "Email input is invalid or password is below 8 characters!"
		})
	}

	if(!firstName || !lastName){
		return res.status(400).json({
			message: "First and last names should be given."
		})
	}

	try {
		// Checking if the user already exists
		const existingUser =  await User.findOne({firstName, lastName, email});

		if (existingUser){
			return res.status(409).json({
				message: "User already existing in our system."
			})
		}

		// Create new user
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: bcrypt.hashSync(password,10)
		})

		// Save user
		const savedUser = await newUser.save();

		return res.status(201).json({
			message: "User created successfully",
			user: savedUser
		})
	}
	catch (err) {
		return errorHandler(err,req,res);
	}
}

// 2) Login User
module.exports.loginUser = async (req,res) => {
	const {email, password} = req.body;

	if(!email.includes("@") || password.length < 8){
		return res.status(400).json({
			message: "Email or password input invalid"
		})
	}

	try {
		const user = await User.findOne({email});

		if (!user) {
			return res.status(404).json({
				message: "User account does not exist. Register first."
			})
		}

		const isPasswordCorrect = bcrypt.compareSync(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(401).json({
				message: "Incorrect email or password"
			});
		}

    // ✅ Password is correct, generate and return token
		const token = createAccessToken(user);

		return res.status(200).json({
			message: "User successfully logged in",
			access: token
		});
	}
	catch (err) {
		return errorHandler(err, req, res);
	}
}

// 3) Get All Users
module.exports.getAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find().sort({isAdmin: -1})

		return res.status(200).json({
			success: true,
			message: "All Users retrieved",
			result: allUsers
		})
	} catch (err){
		return errorHandler(err, req, res);
	}
}

// 4) Get User Profile
module.exports.getUserProfile = async (req,res) => {
	const {id} = req.user;

	try {
		const userData = await User.findById(id);

		if (!userData) {
			return res.status(404).json({
				success: false,
				message: "User does not exist"
			})
		}

		userData.password = '';
		return res.status(200).json(userData);
	} catch (err){
		return errorHandler(err,req,res);
	}
}

// 5) Set User as an Admin
module.exports.setAsAdmin = async (req,res) => {

	const {userId} = req.params;

	if (!req.user || req.user.isAdmin === false) {
		return res.status(403).json({
			success: false,
			message: "Access denied. Admins only."
		})
	}

	try {
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			})
		}

		user.isAdmin = true;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "User is now set as an admin"
		})
	} catch (err) {
		return errorHandler(err,req,res);
	}
}

// 6) Reset Password
module.exports.resetPassword = async (req,res) => {
	const newPassword = req.body.password;
	const {id} = req.user;

	try {
		// Hashing the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Updating the user's password in the database
		await User.findByIdAndUpdate(id, {password: hashedPassword});

		// Sending a success response
		return res.status(200).json({
			success: true,
			message: "Password resetted successfully"
		})
	} catch (err) {
		return errorHandler(err,req,res);
	}
}

