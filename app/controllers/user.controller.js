const UserSchema = require("../models/user.model");
const UserPost = require("../models/user_post.model");
const nodemailer = require('nodemailer');
const admin = require("firebase-admin");
const serviceAccount = require("../../config/jobportal-fcm.json");


exports.createUser = (req, res) => {
  var newUser = new UserSchema({
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

      if (data.password.trim() === req.body.password.trim()) {
        var str = data.skills.join();


        var array = str.trim().split(",");

        UserPost.find({
          job_category: {
            $in: array
          }
        })
          .then(newData => {
            return res.status(200).send({
              status: true,
              data: newData,
              userData: data
            });
          })
          .catch(err => {
            return res.status(200).send({
              status: false,
              message: err.message
            });
          });
      } else {
        return res.status(200).send({
          status: false,
          message: "incorrect password"
        })
      }
    } else {
      return res.status(200).send({
        status: false,
        message: "user not found"
      });
    }
  });
};

exports.findOneUser = (req, res) => {
  UserSchema.findById(req.params.userId)
    .then(post => {
      if (!post) {
        return res.status(200).send({
          status: false,
          message: "user not found with id " + req.params.userId
        });
      }
      res.send({
        status: true,
        data: post
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(200).send({
          status: false,
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(200).send({
        status: false,
        message: "Error retrieving Activity with id " + req.params.userId
      });
    });
};

exports.findAllUser = (req, res) => {
  UserSchema.find()
    .then(data => {
      if (data.length > 0) {
        return res.status(200).send({
          status: true,
          data: data
        });
      } else {
        return res.status(200).send({
          status: false,
          message: "no record found"
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

exports.deleteUser = (req, res) => {
  UserSchema.deleteOne({
    _id: req.params.userId
  })
    .then(data => {
      if (data) {
        return res.status(200).send({
          status: true,
          message: "deleted successfully"
        });
      }
    })
    .catch(err => {
      return res.status(200).send({
        status: true,
        message: err.message
      });
    });
};


exports.updatePassword = (req, res) => {

  if (!req.body.password) {
    return res.status(200).json({
      status: false,
      message: 'Password can not be null'
    })
  } else {
    UserSchema.update({
      _id: req.params.id
    }, {
        $set: {
          password: req.body.password
        }
      })
      .then(data => {
        return res.status(200).json({
          status: true,
          message: "Password update successfully"
        })
      })
      .catch(err => {
        return res.status(200).json({
          status: false,
          message: 'Password not updated ' + err.message
        })
      })
  }
}

exports.forgotPassword = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword'
    }
  });

  const mailOptions = {
    from: 'youremail@gmail.com',
    to: req.body.email,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json(error.message)
    } else {
      console.log('Email sent: ' + info.response);
      res.json(info.response)
    }
  });
}


exports.sendNotification = (req, res) => {

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jobportal-58c65.firebaseio.com"
  });


  const registrationToken = req.body.registrationToken;

  const payload = {
    notification: {
      title: "Account Deposit",
      body: "A deposit to your savings account has just cleared."
    }
  };

  const options = {
    priority: "high",
    timeToLive: 60 * 60 *24
  };


  admin.messaging().sendToDevice(registrationToken, payload, options)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });



}


exports.skills = (req, res) => {
  UserSchema.findOne({
    _id: req.params.id
  })
    .then(data => {
      var str = data.skills.join();
      var array = str.trim().split(",");
      UserPost.find({
        job_category: {
          $in: array
        }
      })
        .then(newData => {
          return res.status(200).send({
            status: true,
            data: newData,
            userData: data
          });
        })
        .catch(err => {
          return res.status(200).send({
            status: false,
            message: err.message
          });
        });
    })
    .catch(err => {
      res.status(200).send({
        status: false,
        message: err.message
      })
    })
}