const UserPost = require("../models/user_post.model");

exports.createPost = (req, res) => {
  const newPost = new UserPost({
    job_title: req.body.job_title,
    job_description: req.body.job_description,
    job_category: req.body.job_category,
    job_location: req.body.job_location,
    user_id: req.params.user_id,
    contact_type: req.body.contact_type,
    status: req.body.status,
    contact_detail: req.body.contact_detail,
    budget: req.body.budget
  });
  newPost
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

exports.getAllPost = (req, res) => {
  UserPost.find()
    .then(data => {
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
    })
    .catch(err => {
      return res.status(200).send({
        status: false,
        message: err.message
      });
    });
};

exports.findOnePost = (req, res) => {
  UserPost.findById({
      user_id: req.params.userId
    })
    .then(post => {
      if (!post) {
        return res.status(200).send({
          status: false,
          message: "post not found with id " + req.params.userId
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
        user_id: req.params.user_id,
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

  if (!jobTitle && !jobCat) {
    return res.status(200).json({
      status: false,
      message: "null or empty not allowed"
    })
  }

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
              $lte: new Date(req.body.end_date)
            }
          }
        }]).exec((err, data) => {
          if (err) {
            return res.json(err.message);
          } else {
            return res.json(data);
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

// exports.searchByDate = (req, res) => {
//   UserPost.aggregate([{
//     $match: {
//         createdAt: {
//           $gte: new Date(req.body.start_date),
//           $lte: new Date(req.body.end_date)
//         }
//     }
//   }]).exec((err, data) => {
//     if(err) {
//       return res.json(err.message);
//     } else {
//       return res.json(data);
//     }
//   })
// }