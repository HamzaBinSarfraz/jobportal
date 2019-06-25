const SubAdmin = require("../models/subadmin.model");

exports.createSubadmin = (req, res) => {

    const subadmin= new SubAdmin(req.body)

    subadmin.save().then(data=>{
        if (data) {
            return res.status(200).send({
              status: true,
              data: data
            });
          } else {
            return res.status(200).send({
              status: false,
              message: "unable to create Subadmin"
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

exports.findSubadmin=(req,res)=>{
    SubAdmin.find()
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
}

exports.updateSubadmin=(req,res)=>{
    SubAdmin.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      })
        .then(subadmin => {
          if (!subadmin) {
            return res.status(200).send({
              success: false,
              message: "Subadmin not found with id " + req.params.id
            });
          }
          res.status(200).send({
            success: true,
            data: subadmin
          });
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(200).send({
              success: false,
              message: "Subadmin not found with id " + req.params.id
            });
          }
          return res.status(200).send({
            success: false,
            message: "Error updating Subadmin with id " + req.params.id
          });
        });
}
exports.deleteSubadmin=(req,res)=>{
    SubAdmin.findByIdAndUpdate(req.params.id, {
        username:null,
        password:null,
        email:null
    }, {
        new: true
      }).then(data=>{
        if (data) {
            return res.status(200).send({
              status: true,
              message: 'Subadmin Deleted Successfully'
            });
          } else {
            return res.status(200).send({
              status: false,
              message: "unable to delete Subadmin"
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