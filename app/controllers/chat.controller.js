
const ChatSchema = require('../models/chat.model');
const postSchama = require('../models/user_post.model')

exports.sendChatMessages = (req, res) => {
    console.log('............');

    console.log(req.body.postid);

    if (typeof req.file !== 'undefined') {
        let type = 'file'
        console.log('yes m here');
        var name = 'https://job-portal-asad.herokuapp.com/' + req.file.filename;
        let msg = {
            sender: req.body.sender,
            receiver: req.body.receiver,
            room: req.body.room,
            receiverid: req.body.receiverid,
            senderid: req.body.senderid,
            postid: req.body.postid,
            type: type,
            message: name
        }
        const chat = new ChatSchema(msg);
        chat.save().then(data => {
            global.io.emit('send_message', msg);
            res.end()
        })
    }
    else {
        let type = 'text'
        let msg = req.body
        msg.type = type;
        const chat = new ChatSchema(msg);
        chat.save().then(data => {
            global.io.emit('send_message', msg);
            res.end()
        })
    }
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
            success:true,
            data:data1  
          })
            }).catch(err=>{
                res.send({
                    success:false,
                    message:err.message
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
    }).catch(err=>{
        res.send({
            success:false,
            message:err.message
        })
})
}