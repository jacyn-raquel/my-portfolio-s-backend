const Project = require('../models/Project');
const {errorHandler} = require('../auth');
const {validationResult} = require('express-validator');

// 1) Add Project
module.exports.addProject = async (req,res) => {
	const {title, projectDescription, url, myRole, category, tools, features} = req.body;
	const {id} = req.user;

	try {
		const existingProject = await Project.findOne({title, category, tools});

		if(existingProject){
			return res.status(409).json({
				message: "Post already exists."
			})
		}

		// const imageURLs = req.files.map(file => `/uploads/${file.filename}`)

		const newProject = new Project({
			userId: id,
			title,
			projectDescription,
			url,
			myRole,
			category,
			tools,
			features
		})

		const savedProject = await newProject.save();

		return res.status(201).json({
			success: true,
			savedProject
		})
	} catch (err) {
		return errorHandler(err,req,res);
	}
}

// 2) Get All Projects
module.exports.getAllProjects = async (req,res) => {
	try {
		const allProjects = await Project.find().sort({dateAdded: -1}); //Sort by creation date (latest first)

		if(allProjects.length === 0){
			return res.status(404).json({
				success:true,
				message: "No projects exist."
			});
		}

		return res.status(200).json({
			success: true,
			message: "All projects retrieved.",
			result: allProjects
		})
	} catch (err) {
		return errorHandler(err,req,res);
	}
}

// 3) Get Specific Project
module.exports.getSpecificProject = async (req,res) => {

	const {projectId} = req.params;

	try {

		const specificProject = await Project.findById(projectId);

		if (!specificProject){
			return res.status(404).json({
				success: true,
				message: "No existing project with this ID."
			});
		}

		return res.status(200).json({
				success: true,
				message: "Retrieved Project successfully",
				specificProject
			})
	} catch (err) {
		return errorHandler(err,req,res);
	}
}

// 4) Edit Specific Project
module.exports.editSpecificProject = async(req,res) => {
	const {projectId} = req.params;
	const {title, projectDescription, url, myRole, category, tools, features, imageURLs, dateEdited, isFeatured} = req.body; 
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
	    return res.status(400).json({ errors: errors.array() });
	  }

	try{
		const projectToUpdate = await Project.findByIdAndUpdate(
			projectId,
			{
				$set: {
					title,
					projectDescription,
					url,
					myRole,
					category,
					tools,
					features,
					imageURLs,
					dateEdited: Date.now(),
					isFeatured
				}
			},{new:true});

		if (!projectToUpdate){
			return res.status(404).json({
				success: true,
				message: "Project not found."
			})
		}

		return res.status(200).json({
			success:true,
			message: "Project updated successfully",
			project: projectToUpdate
		})
	} catch (err){
		return errorHandler(err,req,res);
	}
}

// 5) Archive Project
module.exports.archiveProject = async (req,res) => {
	const {projectId} = req.params;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
	    return res.status(400).json({ errors: errors.array() });
	  }

	try {
		const projectToArchive = await Project.findByIdAndUpdate(projectId,
			{isActive: false},
			{new: true});

		if (!projectToArchive){
			return res.status(404).json({
				success: false,
				message: "Project is not found. Probably deleted already."
			})
		}

		if (projectToArchive.isActive === false){
			return res.status(409).json({
				message: "Project already archived."
			})
		}

		return res.status(200).json({
			success: true,
			message: "Project is now archived successfully",
			project: projectToArchive
		})
	} catch (err) {
		return errorHandler(err,req,res);
	}
}

// 6) Activate Project
module.exports.activateProject = async (req,res) => {
	const {projectId} = req.params;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
	    return res.status(400).json({ errors: errors.array() });
	  }

	try {
		const projectToActivate = await Project.findByIdAndUpdate(projectId,
			{isActive: true},
			{new: true});

		if (!projectToActivate){
			return res.status(404).json({
				success: false,
				message: "Project is not found. Probably deleted already."
			})
		}

		if (projectToActivate.isActive === true){
			return res.status(409).json({
				success: false,
				message: "Project already activated."
			})
		}

		return res.status(200).json({
			success: true,
			message: "Project is now activated successfully",
			project: projectToActivate
		})
	} catch (err){
		return errorHandler(err,req,res);
	}
}

// 7) Delete Project
module.exports.deleteProject = async (req,res) => {
	const {projectId} = req.params;

	try {

		const projectToDelete = await Project.findByIdAndDelete(projectId);

		if (!projectToDelete){
			return res.status(404).json({
				success: true,
				message: "No project found. Probably deleted already."
			})
		}

		return res.status(200).json({
			success: true,
			message: "Project is deleted successfully",
			project: projectToDelete
		})
	} catch (err) {
		return errorHandler(err,req,res);
	}
}