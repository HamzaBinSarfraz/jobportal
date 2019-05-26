const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    job_title: String, 
    job_description: String, 
    job_category: String, 
    job_location: String, 
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }, 
    contact_type: {
        type: String,
        require: true,
        enum: ['call', 'email', 'facebook', 'messenger']
    },
    status: {
        type: String,
        require: true,
        enum: ['not assigned', 'assigned', 'completed']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('userpost', UserSchema);
