const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
// const upload = require('../middlewares/uploads');
const projectControllers = require('../controllers/projects');
const {verify, verifyAdmin} = require('../auth');

// 1) Add Project
router.post('/', verify, verifyAdmin, projectControllers.addProject);

// 2) Get All Projects
router.get('/', projectControllers.getAllProjects);

// 3) Get Specific Project
router.get('/:projectId', projectControllers.getSpecificProject);

// 4) Edit/Update Project
router.patch('/:projectId', verify, verifyAdmin, [
  body('title').optional().isString().trim().notEmpty(),
  body('projectDescription').optional().isArray(),
  body('url').optional().isString().trim().notEmpty(),
  body('tools').optional().isArray(),
  body('category').optional().isArray(),
  body('isFeatured').optional().isBoolean()
], projectControllers.editSpecificProject);

// 5) Archive Project
router.patch('/:projectId/archive',verify, verifyAdmin, projectControllers.archiveProject);

// 6) Activate Project
router.patch('/:projectId/activate', verify, verifyAdmin, projectControllers.activateProject);

// 7) Delete a Project
router.delete('/:projectId', verify, verifyAdmin, projectControllers.deleteProject);


module.exports = router;