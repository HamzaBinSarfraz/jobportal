const mongoose = require("mongoose");

var UserSchema = mongoose.Schema(
  {
    name: String,
    username: {
      type: String,
      unique: true
    },
    password: String,
    email: {
      type: String,
      require: true
    },
    contact_no: Number,
    city: String,
    skills: [String],
    user_image: String
  },
  {
    timestamp: true
  }
);

module.exports = mongoose.model("user", UserSchema);
