module.exports = app => {
  const User = require("../controllers/user.controller");
  // Create a new user
  app.post("/user", User.createUser);
};
