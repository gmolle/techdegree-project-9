'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const Sequelize = require('sequelize');
const models = require('./models').sequelize;

//Instantiate an instance of the Sequelize class and 
//configure the instance to use the fsjstd-restapi.db SQLite database that you generated when setting up the project.

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./fsjstd-restapi.db"
})

db.authenticate()
  .then(() => {
    console.log('Connected to database.');
  })
  .catch(err => console.error('The connection failed.'));

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(express.json());

// TODO setup your api routes here

app.use('/api', require('./routes/index'));
app.use('/api/users', require('./routes/user'));
app.use('/api/courses', require('./routes/course'));


// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
