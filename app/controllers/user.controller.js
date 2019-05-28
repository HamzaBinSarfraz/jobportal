const UserSchema = require("../models/user.model");
const UserPost = require("../models/user_post.model");
const nodemailer = require('nodemailer');
const admin = require("firebase-admin");
require('../../config/fcm/initialize_app');


exports.createUser = (req, res) => {
  if(typeof req.file !== 'undefined') {
    let imagePath = 'https://job-portal-asad.herokuapp.com/' + req.file.path;
    imagePath = imagePath.split('/images/').join('/')
    console.log(imagePath);
    const newUser = new UserSchema({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      contact_no: req.body.contact_no,
      city: req.body.city,
      skills: req.body.skills,
      user_image: imagePath,
      registration_token: req.body.registration_token
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
  }  else {
    const newUser = new UserSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      contact_no: req.body.contact_no,
      city: req.body.city,
      skills: req.body.skills,
      registration_token: req.body.registration_token
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
  }
};

exports.userLogin = (req, res) => {
  UserSchema.find({
    username: req.body.username
  }).then(data => {
    if (data.length > 0) {
      if (data[0].password === req.body.password) {

        const str = data[0].skills.join();
        const array = str.trim().split(",");

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

  UserSchema.find({
    email: req.body.email
  })
    .then(data => {
      if (data.length > 0) {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'usmansajjad138@gmail.com',
            pass: 'USMANmalik4747'
          }
        });

        const mailOptions = {
          from: 'usmansajjad138@gmail.com',
          to: req.body.email,
          subject: 'Bla',
          text: 'its easy'
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {

            console.log(error.message);
            return res.status(200).send({
              status: false,
              message: error.message
            })

          }
          else {

            console.log('email sent successfully...');
            return res.status(200).send({
              status: true,
              message: 'Email sent ' 
            })
          }
        });
      } else {
        return res.status(200).send({
          status: false,
          message: 'Email not found'
        })
      }
    })
    .catch(err => {
      return res.status(200).send({
        status: false,
        message: err.message
      })
    })
}


exports.sendNotification = (req, res) => {

  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   databaseURL: "https://jobportal-2d5f7.firebaseio.com"
  // });


  const registrationToken = req.body.registrationToken;

  const payload = {
    notification: {
      title: "Account Deposit",
      body: "A deposit to your savings account has just cleared."
    }
  };

  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };


  admin.messaging().sendToDevice(registrationToken, payload, options)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
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


exports.updateRegistrationToken = (req, res) => {
  console.log(' i am here ... ');
  UserSchema.update({
    _id: req.params.id
  }, {
    $set: {
      registration_token: req.body.registration_token
    }
  })
  .then(data => {
    return res.status(200).send({
      status: true,
      message: 'token updated successfully'
    })
  })
  .catch(err => {
    return res.status(200).send({
      status: false,
      message: err.message
    })
  })
}


exports.updateUser = (req, res) => {
  if(req.file !== undefined) {
    let imagePath = 'https://job-portal-asad.herokuapp.com/' + req.file.path;
    imagePath = imagePath.split('/images/').join('/');
    UserSchema.update({
      _id: req.params.id
    }, {
      $set: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        contact_no: req.body.contact_no,
        city: req.body.city,
        skills: req.body.skills,
        user_image: imagePath
      }
    })
    .then(data => {
      return res.status(200).send({
        status: true,
        message:  'updated successfully'
      })
    })
    .catch(err => {
      return res.status(200).send({
        status: false,
        message: err.message
      })
    })
  } else {
    UserSchema.update({
      _id: req.params.id
    }, {
      $set: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        contact_no: req.body.contact_no,
        city: req.body.city,
        skills: req.body.skills
      }
    })
    .then(data => {
      return res.status(200).send({
        status: true,
        message:  'updated successfully without image'
      })
    })
    .catch(err => {
      return res.status(200).send({
        status: false,
        message: err.message
      })
    })
  }
}