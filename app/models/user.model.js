const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: String, 
    username: String, 
    password: String, 
    email: {
        type: String, 
        require: true
    }, 
    contact_no: Number, 
    city: String, 
    skills: String

}, {
    timestamp: true
})

module.exports = mongoose.model('user', UserSchema);