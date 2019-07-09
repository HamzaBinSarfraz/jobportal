const SubAdmin = require("../models/subadmin.model");

exports.createSubadmin = (req, res) => {
  validateUserName(req, res, function (result) {
    console.log('...................', result);
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
              createSubadmin(req, res);
            }
          })
        }
      })
    }
  })
}

function createSubadmin(req, res) {
  const subadmin = new SubAdmin(req.body)
  subadmin.save().then(data => {
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

exports.findSubadmin = (req, res) => {
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
exports.getOneSubadmin=(req,res)=>{
  SubAdmin.findById(req.params.id).then(data=>{
    if(!data){
      res.send({
        success:true,
        message:'No SubAdmin Found'
      })
    }
    else{
      res.send({
        success:true,
        data:data
      })
    }
  }).catch(err=> {
    res.status(200).send({
      status: false,
      message: err.message
    });
  });


}
exports.updateSubadmin = (req, res) => {
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
exports.deleteSubadmin = (req, res) => {
  SubAdmin.findByIdAndUpdate(req.params.id, {
    username: null,
    password: null,
    email: null
  }, {
      new: true
    }).then(data => {
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

exports.subadminLogin = (req, res) => {
  SubAdmin.findOne(
    {
      $or: [{
        email: req.body.email
      }, {
        username: req.body.username
      }]

    }
  )
    .then(data => {
      if (data.password === req.body.password) {
        return res.status(200).send({
          status: true,
          data: data
        })
      } else {
        return res.status(200).send({
          status: false,
          message: "Subadmin not found"
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
function validateUserName(req, res, callback) {
  SubAdmin.find({
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
  SubAdmin.find({ email: req.body.email }).then(data => {
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
  SubAdmin.find({ contact_no: req.body.contact_no }).then(data => {

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




// exports.delete = (req, res) => {
//   SubAdmin.remove().then(data => {
//     res.send({
//       success: true,
//       message: 'Deleted All Document'
//     })
//   })
// }
