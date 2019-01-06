const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    job_title: String, 
    job_description: String, 
    job_category: String, 
    job_location: String, 
    user_id: mongoose.Schema.Types.ObjectId

}, {
    timestamp: true
})

module.exports = mongoose.model('userpost', UserSchema);
