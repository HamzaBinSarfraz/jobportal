const mongoose = require("mongoose");

var AdminSchema = mongoose.Schema(
  {
    admin_email: String,
    password: String
  },
  {
    timestamp: true
  }
);

module.exports = mongoose.model("admin", AdminSchema);
