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
        enum: ['not assigned', 'assigned', 'completed'],
        default: 'not assigned'
    },
    poststatus: {
        type: String,
        default: null
    },
    poststatus_user: mongoose.Schema.Types.ObjectId,
    subadmin: {
        type: Boolean,
        default: false
    },
    subadmin_id: mongoose.Schema.Types.ObjectId,
    job_completed: {
        type: Boolean,
        default: false
    },
    file: String,
}, {
        timestamps: true
    });

module.exports = mongoose.model('userpost', UserSchema);
