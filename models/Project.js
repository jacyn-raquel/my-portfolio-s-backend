const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // You had a typo: "red" → should be "ref"
    required: true
  },
  title: {
    type: String,
    required: [true, "Title should be given"]
  },
  projectDescription: {
    type: [String],
    required: [true, "Project description is required"]
  },
  url:{
    type: String,
    required: [true, "URL for project is needed"]
  },
  myRole:{
    type: String,
    required: [true, "Role needs to be filled."]
  }
  ,
  category: {
    type: [String],
    required: [true, "Category is required"]
  },
  tools: {
    type: [String], // Changed to array for multiple tools
    required: [true, "Tools used must be specified"]
  },
  features: {
    type: [String],
    default: []
  },
  imageURLs: {
    type: [String], // Store array of image URLs
    default: []
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  dateEdited: {
    type: Date,
    default: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Project', projectSchema);
