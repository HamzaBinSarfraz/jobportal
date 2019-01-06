const UserSchema = require("../models/user.model");

exports.createUser = (req, res) => {
  var newUser = new UserSchema({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    contact_no: req.body.contact_no,
    city: req.body.city,
    skills: req.body.skills, 
    user_image: req.file.path
  });
  newUser
    .save()
    .then(data => {
      if (data) {
        return res.status(200).send({
          status: true,
          data: data
        });
      } else {
        return res.status(200).send({
          status: false,
          message: "unable to create user"
        });
      }
    })
    .catch(err => {
      return res.status(200).send({
        status: false,
        message: err.message
      });
    });
};

exports.userLogin = (req, res) => {
  UserSchema.findOne({
    username: req.body.username
  }).then(data => {
    if (data) {
      return res.status(200).send({
        status: true,
        data: data,
        message: "user exist"
      });
    } else {
      return res.status(200).send({
        status: false,
        message: "user not found"
      });
    }
  });
};
