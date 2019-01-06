const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    job_title: String, 
    job_description: String, 
    job_category: String, 
    job_location: String, 
    user_id: req.params.user_id

}, {
    timestamp: true
})

module.exports = mongoose.model('userpost', UserSchema);
