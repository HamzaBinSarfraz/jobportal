const mongoose = require("mongoose");

var SkillSchema = mongoose.Schema(
  {
    skill_title: String,
    skill_category: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("skill", SkillSchema);
