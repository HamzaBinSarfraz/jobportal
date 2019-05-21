const mongoose = require("mongoose");

var UserSchema = mongoose.Schema(
  {
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
    coutry: String,
    skills: [String],
    user_image: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", UserSchema);
