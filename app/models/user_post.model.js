const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    job_title: String, 
    job_description: String, 
    job_category: String, 
    job_location: String, 
    user_id: mongoose.Schema.Types.ObjectId, 
    contact_type: String

}, {
    timestamp: true
})

module.exports = mongoose.model('userpost', UserSchema);
