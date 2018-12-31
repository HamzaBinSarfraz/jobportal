const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

// create express app npm
const app = express();

app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

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

// import all routes at once
require("./config/routes.config")(app);

//require('.//app/routes/custom_clearance_routes')(app)
// listen for requests
var port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log("Server is listening on port " + port);
});
