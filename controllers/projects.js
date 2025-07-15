const Project = require('../models/Project');
const {errorHandler} = require('../auth');


// 1) Add Project
module.exports.addProject = async (req,res) => {
	const {title, projectDescription, category, tools, features} = req.body;
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
		const allProjects = await Post.find().sort({dateAdded: -1}); //Sort by creation date (latest first)

		if(allProjects.length === 0){
			return res.status(404).json({
				success:true,
				message: "No posts exist."
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