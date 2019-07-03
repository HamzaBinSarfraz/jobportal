const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    job_title: String,
    job_description: String,
    job_category: String,
    job_location: String, 
    budget: String,
    contact_detail: String,
    user_id: mongoose.Schema.Types.ObjectId, 
    contact_type: {
        type: String,
        require: true,
        enum: ['call', 'email', 'chat', 'messanger']
    },
    status: {
        type: String,
        require: true,
        enum: ['not assigned', 'assigned', 'completed']
    },
    job_completed:String,
}, {
    timestamps: true
});

module.exports = mongoose.model('userpost', UserSchema);
