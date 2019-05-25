const mongoose = require("mongoose");

var UserSchema = mongoose.Schema(
  {
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
      trim: true
    },
    contact_no: Number,
    city: String,
    coutry: String,
    skills: [String],
    user_image: String,
    registration_token: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", UserSchema);
