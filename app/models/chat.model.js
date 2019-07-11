const mongoose = require("mongoose");

var ChatSchema = mongoose.Schema(
  {
    sender: {
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    receiverid: mongoose.Schema.Types.ObjectId, 
    senderid: mongoose.Schema.Types.ObjectId,
    postid:mongoose.Schema.Types.ObjectId, 
    room:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    message: {
        type:String,
        required:true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("chat", ChatSchema);
