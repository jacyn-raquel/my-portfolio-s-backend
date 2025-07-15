const express = require('express');
const router = express.Router();
// const upload = require('../middlewares/uploads');
const projectControllers = require('../controllers/projects');
const {verify, verifyAdmin} = require('../auth');

// Add Project
router.post('/', verify, verifyAdmin, projectControllers.addProject);

// Get All Projects
router.get('/', verify, projectControllers.getAllProjects);

module.exports = router;