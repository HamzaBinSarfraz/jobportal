
const ChatSchema = require('../models/chat.model')

exports.sendChatMessages = (req, res) => {
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