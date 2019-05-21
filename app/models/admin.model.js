const mongoose = require("mongoose");

var AdminSchema = mongoose.Schema(
  {
    admin_email: String,
    password: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("admin", AdminSchema);
