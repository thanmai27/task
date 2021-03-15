require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middileware/error');
const express = require('express');
const bodyParser = require('body-parser');
const jwtVerify = require('./middileware/jwtVerify');
// const env =  require('dotenv').config()
const cors = require('cors');


winston.add(new winston.transports.File({ filename: 'loggin_error.log' }));
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost:27017/GreenMatters' }));
const { mongoose } = require('./db');

var contactController = require('./controllers/contactController');
//var azure = require('./controllers/azureblob');
var userController = require('./controllers/usercontroller');
var projectController = require('./controllers/projectcontroller');
var taskController = require('./controllers/taskController');
var taskdemoController = require('./controllers/taskdemoController');
var oauthController = require('./controllers/oAuthController');
var employeeController = require('./controllers/employeeController')
// var fbAuthController = require('./controllers/fbAuthController')


var app = express();
app.use(bodyParser.json());
// app.use(cors({ origin: 'http://localhost:4200' }));
const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOption));

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//     );
//     next();
//   });


app.use('/contact', jwtVerify, contactController)
    //app.use('/upload', azure)
app.use('/user',userController);
app.use('/project',jwtVerify, projectController);
app.use('/task',jwtVerify, taskController);
app.use('/taskdemo', taskdemoController);
app.use('/',oauthController);
app.use('/employee',jwtVerify, employeeController);
// app.use('/fb',fbAuthController)


app.use(error);

app.listen(3000, () => console.log('Server started at port : 3000'));
