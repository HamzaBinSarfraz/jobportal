const mongoose = require('mongoose');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const SubAdminSchema = mongoose.Schema({
    subadmin_name: String,
    password: String,
    username: {
        type: String,
        // unique: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        // unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],

    },
    contact_no: {
        type: String,
        required: true,
        unique: true

    },
    role: String
}, {
        timestamps: true
    })

module.exports = mongoose.model('subadmin', SubAdminSchema);

