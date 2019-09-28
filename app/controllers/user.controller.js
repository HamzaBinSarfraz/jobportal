

const UserSchema = require("../models/user.model");
const UserPost = require("../models/user_post.model");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');



exports.createUser = (req, res) => {
  validateUserName(req, res, function (result) {
    if (result == 1) {
      return res.send({
        success: false,
        message: 'User Name Already Exist'
      })
    }
    else {
      svalidateEmail(req, res, function (result1) {
        if (result1 == 1) {
          return res.send({
            success: false,
            message: 'Email Already Exist'
          })
        }
        else {
          validatecellno(req, res, function (result2) {
            if (result2 == 1) {
              return res.send({
                success: false,
                message: 'Contact Number  Already Exist'
              })
            }
            else {
              CreateUserData(req, res);
            }
          })
        }
      })

    }

  })
};

function CreateUserData(req, res) {
  console.log('.........');

  console.log(req.body);

  if (typeof req.file !== 'undefined') {
    // let imagePath = 'http://153.92.4.132:5000/' + req.file.path;
    // imagePath = imagePath.split('/images/').join('/')
    // console.log(imagePath);
    // let imagePath = req.file.path;
    let imagePath = req.file.path.replace('images/', '')
    const newUser = new UserSchema({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      contact_no: req.body.contact_no,
      city: req.body.city,
      skills: req.body.skills,
      user_image: imagePath,
      registration_token: req.body.registration_token,
      subadmin: req.body.subadmin,
      subadmin_id: req.body.subadmin_id
    });
    newUser
      .save()
      .then(data => {
        if (data) {
          return res.status(200).send({
            success: true,
            data: data
          });
        } else {
          return res.status(200).send({
            success: false,
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
  } else {
    const newUser = new UserSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      contact_no: req.body.contact_no,
      city: req.body.city,
      skills: req.body.skills,
      registration_token: req.body.registration_token,
      subadmin: req.body.subadmin,
      subadmin_id: req.body.subadmin_id
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

}

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


exports.getUserByEmail = (req, res) => {
  UserSchema.find({
    email: req.body.email
  })
    .then(data => {
      if (data.length > 0) {
        return res.status(200).json({
          status: true,
          data: data
        })
      } else {
        return res.status(200).json({
          status: false,
          message: "email not found"
        })
      }
    })
    .catch(err => {
      return res.status(200).json({
        status: false,
        message: err.message
      })
    })
}

exports.forgotPassword = (req, res) => {
  console.log(req.body.email);

  UserSchema.find({
    email: req.body.email
  })
    .then(data => {
      if (data.length > 0) {
        const transporter = nodemailer.createTransport(smtpTransport({
       
          service: 'Gmail',
          auth: {
            user: 'jobsproject.testing@gmail.com',
            pass: 'jobsproject'
          },
          tls: {
            rejectUnauthorized: true
        }
        }));

        const mailOptions = {
          from: 'jobsproject.testing@gmail.com',
          to: req.body.email,
          subject: 'Forget Password Request',
          text: 'https://adminpannel-62687.firebaseapp.com/forget/' + data[0]._id
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

exports.resetPassword = (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  UserSchema.findOne({
    _id: req.params.id
  }).then(user => {
    let newuser = user;
    console.log(newuser);
    if (newuser.password == req.body.oldpass) {
      newuser.password = req.body.newpass;
      UserSchema.findByIdAndUpdate(req.params.id, newuser, {
        new: true
      }).then(data => {
        res.send({
          success: true,
          data: data
        })
      })
    }
    else {
      res.send({
        success: true,
        message: 'Current Password not  match'
      })
    }
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
  if (req.file !== undefined) {
    let imagePath = req.file.path.replace('images/', '')
    // let imagePath = 'https://job-portal-asad.herokuapp.com/' + req.file.path;
    // imagePath = imagePath.split('/images/').join('/');
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
          message: 'updated successfully'
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
          message: 'updated successfully without image'
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


function validateUserName(req, res, callback) {
  UserSchema.find({
    username: req.body
      .username
  }).then(data => {
    if (data.length > 0) {
      callback(1)
    }
    else {
      callback(0)
    }
  }).catch(err => {
    console.log(err);
  })
}

function svalidateEmail(req, res, callback) {
  UserSchema.find({ email: req.body.email }).then(data => {
    if (data.length > 0) {
      callback(1)
    }
    else {
      callback(0)

    }
  }).catch(err => {
    console.log(err);
  })
}
function validatecellno(req, res, callback) {
  UserSchema.find({ contact_no: req.body.contact_no }).then(data => {

    if (data.length > 0) {
      callback(1)
    }
    else {
      callback(0)
    }
  }).catch(err => {
    console.log(err);

  })
}
