const AdminSchema = require("../models/admin.model");

exports.createUser = (req, res) => {
  var newUser = new AdminSchema(req.body);
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

exports.updatePost = (req, res) => {
  AdminSchema.update(
    { _id: req.params.id },
    {
      $set: {
        admin_email: req.body.admin_email,
        password: req.body.password
      }
    },
    { new: true }
  )
    .then(data => {
      if (!data) {
        return res.status(200).send({
          status: false,
          message: "admin not found with id " + req.params.id
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

exports.getAll = (req, res) => {
  AdminSchema.find()
    .then(data => {
      res.status(200).send({
        status: true,
        data: data
      });
    })
    .catch(err => {
      res.status(200).send({
        status: false,
        message: err.message
      });
    });
};

exports.getOne = (req, res) => {
  AdminSchema.findOne({
    _id: req.params.id
  })
    .then(data => {
      res.status(200).send({
        status: true,
        data: data
      });
    })
    .catch(err => {
      res.status(200).send({
        status: true,
        message: err.message
      });
    });
};


exports.login = (req, res) => {
  AdminSchema.findOne(
    {
      admin_email: req.body.admin_email
    }
  )
    .then(data => {
      if (data.password === req.body.password) {
        return res.status(200).send({
          status: true,
          data: data
        })
      }
    })
    .catch(err => {
      res.status(200).send({
        status: false,
        message: err.message
      })
    })
}