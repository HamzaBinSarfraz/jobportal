const UserPost = require("../models/user_post.model");

exports.createPost = (req, res) => {
  var newPost = new UserPost({
    job_title: req.body.job_title,
    job_description: req.body.job_description,
    job_category: req.body.job_category,
    job_location: req.body.job_location, 
    user_id: req.params.user_id
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
  UserPost.findById(req.params.postId)
    .then(post => {
      if (!post) {
        return res.status(200).send({
          message: "post not found with id " + req.params.postId
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
          message: "post not found with id " + req.params.postId
        });
      }
      return res.status(200).send({
        status: false,
        message: "Error retrieving Activity with id " + req.params.postId
      });
    });
};

exports.updatePost = (req, res) => {
  UserPost.update(
    { _id: req.params.postId },
    {
      $set: {
        job_title: req.body.job_title,
        job_description: req.body.job_description,
        job_category: req.body.job_category,
        job_location: req.body.job_location, 
        user_id: req.params.user_id
      }
    },
    { new: true }
  )
    .then(data => {
      if (!data) {
        return res.status(200).send({
          status: false,
          message: "Post not found with id " + req.params.postId
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "updated statusfully"
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
