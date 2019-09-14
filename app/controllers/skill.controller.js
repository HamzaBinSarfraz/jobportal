const SkillSchema = require("../models/skills.model");

exports.createSkills = (req, res) => {
  var skill = new SkillSchema(req.body);
  skill
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
          message: "unable to Skills"
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

exports.getAllSkill=(req,res)=>{
    SkillSchema.find()
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

exports.deleteSkill=(req,res)=>{
    SkillSchema.findByIdAndRemove(req.params.id)
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
}

exports.getOneSkill=(req,res)=>{
    SkillSchema.findById(req.params.id)
    .then(data => {
      if (data) {
        return res.status(200).send({
          status: true,
          data:data
        });
      }
      else{
        return res.status(200).send({
            status: true,
            message:'No Skill Found'
          });
      }
    })
    .catch(err => {
      return res.status(200).send({
        status: true,
        message: err.message
      });
    });
}
exports.updateSkill=(req,res)=>{
  SkillSchema.findByIdAndUpdate(req.params.id,req.body).then(data=>{
    if(data){
      res.send({
        success:true,
        data:data
      })
    }
    else{
      res.send({
        success:true,
        data:'Unable to update'
      })
    }
  }).catch(err=>{
    res.send({
      success:false,
      message:err.message
    })
  })
}

exports.uniqueCat=(req,res)=>{
  SkillSchema.find().distinct('skill_category')
  // .select('skill_category')
  .then(data=>{
    if(data){
      res.send({
        success:true,
        data:data
      })
    }
    else{
      res.send({
        success:true,
        data:'Unable to update'
      })
    }
  }).catch(err=>{
    res.send({
      success:false,
      message:err.message
    })
  })
}