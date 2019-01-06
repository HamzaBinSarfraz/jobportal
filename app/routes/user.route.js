module.exports = app => {
  const User = require("../controllers/user.controller");
  const Image = require('../../utility/image_upload.utility');
  // Create a new user
  app.post("/signup", Image, User.createUser);
  app.post('/login', User.userLogin);
};
