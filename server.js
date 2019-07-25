const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const morgan = require('morgan');
const ngrok = require('ngrok');
connections = [];
// create express app npm
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
global.io = io;
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(morgan("dev"));

// Configuring the database
const dbConfig = require("./config/db.config.js");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.set("useCreateIndex", true);
// Connecting to the database
mongoose
  .connect(
    dbConfig.url,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err.message);
    process.exit();
  });

// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to job portal" });
});
