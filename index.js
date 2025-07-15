const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


// Routes Import
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');

// Config dotenv
dotenv.config();

//Create the app
const app = express();

// Middleware to understand JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connection with MongoDB
mongoose.connect(process.env.MONGODB_STRING);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error!"));
db.once('open', ()=>console.log('Now connected to MongoDB Atlas!'));

// Cors configuration
const corsOptions = {
	origin: ['http://localhost:4000', 'http://localhost:3000'],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


// Routes Main endpoints
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);


// App listens
if(require.main === module){
	app.listen(process.env.PORT || 4001, ()=>console.log(`API is now online on port ${process.env.PORT || 4001}`));
}

module.exports = {app, mongoose};