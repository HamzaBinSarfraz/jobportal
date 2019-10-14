const mongoose = require("mongoose");

var UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },
    username: {
      type: String,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true
    },
    contact_no: {
      type: String,
      unique: true,
      require: true
    },
    city: String,
    coutry: String,
    skills: {
      type: Array
    },
    user_image: {
      type: String,
      default: null
    },
    subadmin: {
      type: Boolean,
      default: false
    },
    subadmin_id: mongoose.Schema.Types.ObjectId, 
    registration_token: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", UserSchema);
