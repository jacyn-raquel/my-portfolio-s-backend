const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
// const upload = require('../middlewares/uploads');
const projectControllers = require('../controllers/projects');
const {verify, verifyAdmin} = require('../auth');

// Add Project
router.post('/', verify, verifyAdmin, projectControllers.addProject);

// Get All Projects
router.get('/', projectControllers.getAllProjects);

// Get Specific Project
router.get('/:projectId', projectControllers.getSpecificProject);

// Edit/Update Project
router.patch('/:projectId', verify, verifyAdmin, [
  body('title').optional().isString().trim().notEmpty(),
  body('projectDescription').optional().isArray(),
  body('url').optional().isString().trim().notEmpty(),
  body('tools').optional().isArray(),
  body('category').optional().isArray(),
  body('isFeatured').optional().isBoolean()
], projectControllers.editSpecificProject);

// Delete a Project
router.delete('/:projectId', verify, verifyAdmin, projectControllers.deleteProject);

module.exports = router;