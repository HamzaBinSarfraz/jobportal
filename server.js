
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const morgan = require('morgan');
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
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
  });

// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to job portal" });
});




const publicDir = require('path').join(__dirname, './images');
// console.log(publicDir);
app.use(express.static(publicDir));


// import all routes at once
require("./config/routes.config")(app);

//require('.//app/routes/custom_clearance_routes')(app)
// listen for requests
var port = process.env.PORT || 5000;
server.listen(port, "0.0.0.0", () => {
  console.log("Server is listening on port " + port);
});

// opening Socket Connection.
io.sockets.on('connection', function (socket) {
  // console.log(socket.id);
  
  connections.push(socket);
  console.log('connected: %s socket connected', connections.length)

  // Disconnect the socket
  socket.on('disconnect', function (data) {
    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnected: %s socket connected', connections.length)
  })

})