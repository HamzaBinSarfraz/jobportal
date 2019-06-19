const UserPost = require("../models/user_post.model");
const User = require("../models/user.model");
const admin = require("firebase-admin");
require('../../config/fcm/initialize_app');


exports.createPost = (req, res) => {
  const newPost = new UserPost(req.body);
  newPost
    .save()
    .then(data => {
      if (data) {

        const jobTitle = data.job_title;
        console.log(jobTitle);
        User.find()
          .then(users => {
            users.forEach(element => {
              element.skills.forEach(skills => {
                console.log(skills);
                console.log(skills.toLowerCase().includes(jobTitle.toLowerCase()));
                let regiatrationToken = element.registration_token;
                sendNotifications(regiatrationToken, data, res);
              })
            })
          })
          .catch(err => {
            return res.status(200).json({
              status: false,
              message: err.message
            })
          })

        // if (userId) {

        //   User.find({
        //     _id: userId
        //   })
        //     .then(user => {
        //       sendNotifications(user, data, res);
        //     })
        //     .catch(err => {
        //       return res.status(200).json({
        //         status: false,
        //         message: err.message
        //       })
        //     })


        // } else {
        //   return res.status(200).json({
        //     status: 200,
        //     message: "User not found with id " + userId
        //   })
        // }

      } else {
        return res.status(200).send({
          status: false,
          message: "unable to create user post"
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


function sendNotifications(registrationToken, data, res) {

  console.log(data);

  const payload = {
    // "notification": {
    //   "title": data.job_title,
    //   "body": data.job_description
    // },
    "data": {
      "job_title": data.job_title,
      "job_description": data.job_description,
      "job_category": data.job_category,
      "time_stamp": data.createdAt.toString(),
      "post_id": data._id.toString()
    }
  }

  const options = {
    "job_title": data.job_title,
    "job_description": data.job_description,
    "job_category": data.job_category,
    "time_stamp": data.createdAt
  };

  admin.messaging().sendToDevice(registrationToken, payload, options)
    .then((response) => {
      console.log("Successfully sent message:", response);
      console.log("Error ::: ", response.results[0].error);
      res.status(200).json({
        status: true,
        message: "userpost created and notification send successfully"
      });
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.status(200).json({
        status: false,
        message: err.message
      });
    });
}

exports.getAllPost = (req, res) => {
  UserPost.find()
    .then(data => {
      if (data) {
        return res.status(200).send({
          status: true,
          data: data
        });
      } else {
        return res.status(200).send({
          status: false,
          message: "user not found"
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

exports.findOnePost = (req, res) => {
  UserPost.find({
    user_id: req.params.userId
  })
    .then(post => {
      if (!post) {
        return res.status(200).send({
          status: false,
          message: "post not found with id " + req.params.userId
        });
      } else {
        return res.status(200).send({
          status: true,
          data: post
        });
      }
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(200).send({
          status: false,
          message: "post not found with id " + req.params.userId
        });
      }
      return res.status(200).send({
        status: false,
        message: "Error retrieving Activity with id " + req.params.userId
      });
    });
};

exports.updatePost = (req, res) => {
  UserPost.update({
    _id: req.params.postId
  }, {
      $set: {
        job_title: req.body.job_title,
        job_description: req.body.job_description,
        job_category: req.body.job_category,
        job_location: req.body.job_location,
        contact_type: req.body.contact_type,
        status: req.body.status,
        contact_detail: req.body.contact_detail,
        budget: req.body.budget
      }
    }, {
      new: true
    })
    .then(data => {
      if (!data) {
        return res.status(200).send({
          status: false,
          message: "Post not found with id " + req.params.postId
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "updated successfully"
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

exports.deletePost = (req, res) => {
  UserPost.deleteOne({
    _id: req.params.postId
  })
    .then(data => {
      if (data) {
        return res.status(200).send({
          status: true,
          message: "post deleted successfully by id " + req.params.postId
        });
      } else {
        return res.status(200).send({
          status: false,
          message: "post can not deleted by id " + req.params.postId
        });
      }
    })
    .catch(err => {
      return res.status(200).send({
        status: false,
        message: "an error occured while deleting " + err.message
      });
    });
};



exports.search = (req, res) => {

  const jobTitle = req.body.job_title;
  const jobCat = req.body.job_category;
  const startDate = req.body.start_date;
  const endDate = req.body.end_date;


  if (!jobTitle && !jobCat) {

    console.log('jobtitle and jobcat are null');

    if (startDate === endDate) {

      UserPost.aggregate([{
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      }])

    } else {

      UserPost.aggregate([{
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lt: new Date(endDate)
          }
        }
      }]).exec((err, data) => {
        if (err) {
          return res.status(200).json({
            status: false,
            message: err.message
          });
        } else {
          return res.status(200).json({
            status: true,
            data: data
          });
        }
      });
    }


  } else if (!startDate && !endDate) {
    console.log('startdate and enddate are null');


    UserPost.aggregate([{
      $match: {
        $and: [{
          job_title: {
            $regex: "^" + jobTitle,
            $options: "i"
          },
          job_category: {
            $regex: "^" + jobCat,
            $options: "i"
          }
        }]
      }
    }]).exec((err, data) => {
      if (err) {
        return res.status(200).json({
          status: false,
          message: err.message
        })
      }
      if (data) {
        return res.status(200).json({
          status: true,
          length: data.length,
          data: data
        })
      }
    })


  } else if (!endDate) {
    console.log('enddate is null');

    UserPost.aggregate([{
      $match: {
        $lte: new Date(startDate)
      }
    }]).exec((err, data) => {
      if (err) {
        return res.status(200).json({
          status: false,
          message: err.message
        })
      }
      if (data) {
        return res.status(200).json({
          status: true,
          data: data
        })
      }
    })

  } else {
    UserPost.aggregate([{
      $match: {
        $and: [{
          job_title: {
            $regex: "^" + jobTitle,
            $options: "i"
          },
          job_category: {
            $regex: "^" + jobCat,
            $options: "i"
          }
        }]
      }
    }]).exec((err, data) => {
      if (err) {
        return res.status(200).send({
          status: false,
          message: err.message
        })
      } else {
        if (data.length > 0) {
          // return res.status(200).send({
          //   status: true,
          //   data: data
          // })

          UserPost.aggregate([{
            $match: {
              createdAt: {
                $gte: new Date(req.body.start_date),
                $lt: new Date(req.body.end_date)
              }
            }
          }]).exec((err, data) => {
            if (err) {
              return res.status(200).json({
                status: false,
                message: err.message
              });
            } else {
              return res.status(200).json({
                status: true,
                data: data
              });
            }
          });

        } else {
          return res.status(200).send({
            status: false,
            data: 'no record found'
          })
        }
      }
    });
  }
}

exports.searchWithJobTitle = (req, res) => {
  const jobTitle = req.body.job_title;
  UserPost.aggregate([{
    $match: {
      job_title: {
        $regex: "^" + jobTitle,
        $options: "i"
      }
    }
  }]).exec((err, data) => {
    if (err) {
      return res.status(200).json({
        status: false,
        message: err.message
      });
    }
    if (data) {
      return res.status(200).json({
        status: true,
        data: data
      });
    }
  });
}


exports.matchSkills = (req, res) => {
  const arr = req.body.job_category
  UserPost.find({
    // job_category: { $in: arr }
    job_category: req.body.job_category
  })
  .then(data => {
    if(data.length > 0) {
      return res.status(200).json({
        status: true,
        data: data
      })
    } else {
      return res.status(200).json({
        status: false,
        message: 'no record found'
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