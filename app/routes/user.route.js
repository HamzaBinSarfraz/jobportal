module.exports = app => {
  const User = require("../controllers/user.controller");
  const Image = require('../../utility/image_upload.utility');
  // Create a new user
  
  app.post("/user/signup", Image, User.createUser);
  app.post('/user/login', User.userLogin);
  app.get('/user', User.findAllUser);
  app.get('/user/:userId', User.findOneUser);
  app.delete('/user/:userId', User.deleteUser);

  app.put('/user/updatepassword/:id', User.updatePassword);

  app.post('/user/forgotpassword', User.forgotPassword);

  app.get('/user/skills/:id', User.skills);

  app.put('/user/updatetoken/:id', User.updateRegistrationToken);


  // update user profile
  app.put("/user/updateuser/:id", Image, User.updateUser);

  // app.put('user/:id', User.updatePassword);
  // app.put('user/:');
};
