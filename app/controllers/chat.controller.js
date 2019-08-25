
const ChatSchema = require('../models/chat.model');
const postSchama = require('../models/user_post.model')
const userSchema = require("../models/user.model")
const admin = require("firebase-admin");
require('../../config/fcm/initialize_app');
exports.sendChatMessages = (req, res) => {
    console.log('............');
    console.log(req.body.postid);
    if (typeof req.file !== 'undefined') {
        let type = 'file'
        console.log('yes m here');
        // var name = 'https://job-portal-asad.herokuapp.com/' + req.file.filename;
        var name = req.file.filename;
        let msg1 = {
            sender: req.body.sender,
            receiver: req.body.receiver,
            room: req.body.room,
            receiverid: req.body.receiverid,
            senderid: req.body.senderid,
            postid: req.body.postid,
            type: type,
            message: name
        }
        savechat(req, res, msg1)
    }
    else {
        let type = 'text'
        let msg = req.body
        msg.type = type;
        savechat(req, res, msg)
    }
}

function savechat(req, res, msg) {
    const chat = new ChatSchema(msg);
    chat.save().then(data => {
        let receiver = data.receiverid
        userSchema.findById(receiver)
            .then(result => {
                console.log('result');
                console.log(result);
                if (result.registration_token != null && result.registration_token != undefined) {
                    console.log('token');
                    let token = result.registration_token;
                    sendNotifications(token, data, res);
                }
                else {
                    console.log('***************');
                    console.log('do not send notification');
                }
            })
        global.io.emit('send_message', msg);
        res.end()
    })
}

function sendNotifications(registrationToken, data, res) {
    console.log(data);
    const payload = {

        "data": {
            "title": "New Message",
            "sender": data.sender,
            "receiver": data.receiver,
            "room": data.room,
            "message": data.message,
            "time_stamp": data.createdAt.toString()

        }
    }

    const options = {
        "title": "New Message",
        "sender": data.sender,
        "receiver": data.receiver,
        "room": data.room,
        "message": data.message,
        "time_stamp": data.createdAt
    };

    admin.messaging().sendToDevice(registrationToken, payload, options)
        .then((response) => {
            console.log("Successfully sent message:", response);
            console.log("Error ::: ", response.results[0].error);
            res.status(200).json({
                status: true,
                message: "New Message Notification Send"
            });
        })
        .catch((error) => {
            console.log("Error sending message:", error);
            res.status(200).json({
                status: false,
                message: err.message
            });
        });
}

exports.getChatByRoom = (req, res) => {
    ChatSchema.find({ room: req.params.room }).then(data => {
        if (!data) {
            res.send({
                success: true,
                message: 'Empty Chat for this room'
            })
        }
        else {
            res.send({
                success: true,
                data: data
            })
        }
    }).catch(err => {
        res.send({
            success: false,
            message: err.message
        })
    })

}

exports.getConversation = (req, res) => {
    let id = req.params.id
    ChatSchema.find({
        $or: [
            { receiverid: id },
            { senderid: id }
        ]
    }).distinct("postid").then(data => {
        if (data.length > 0) {
            let arr = data
            postSchama.find({
                _id: {
                    $in: arr
                }
            }).then(data1 => {
                res.send({
                    success: true,
                    data: data1
                })
            }).catch(err => {
                res.send({
                    success: false,
                    message: err.message
                })
            })
        }
        else {
            res.send({
                success: true,
                data: [],
                message: 'No post Available for this user'

            })
        }
    }).catch(err => {
        res.send({
            success: false,
            message: err.message
        })
    })
}

exports.getSpecificChat = (req, res) => {
    ChatSchema.find({
        $and: [
            { postid: req.params.postid }
        ]
    }).distinct("room").then(data => {
        if (data.length > 0) {
            let newarr = []
            data.forEach(element => {
                var parts = element.split('-');
                let newstr = parts[1]
                newarr.push(newstr)
            })
            userSchema.find({
                _id: {
                    $in: newarr
                }
            }).then(result => {
                res.send({
                    success: true,
                    data: result
                })
            }).catch(err => {
                res.send({
                    success: false,
                    message: err.message
                })
            })
        }
        else {
            res.send({
                success: true,
                message: "No User Chat on this Post yet"
            })
        }
    }).catch(err => {
        res.send({
            success: false,
            message: err.message
        })
    })
}