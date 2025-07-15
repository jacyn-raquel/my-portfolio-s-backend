const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, "First Name should be provided."]
	},
	lastName: {
		type: String,
		required: [true, "Last Name should be provided."]
	},
	email: {
		type: String,
		required: [true, "Above all, Email address should be provided."]
	},
	password: {
		type: String,
		required: [true, "Password should never be forgotten."]
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	dateAccountCreated: {
		type: Date,
		default: Date.now()
	}
})

module.exports = mongoose.model('User', userSchema);