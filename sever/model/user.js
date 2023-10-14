const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    password: {
        type: String,
    },
    admin: {
        type: Boolean,
        required: true,
    }
});

const Users = mongoose.model('Users', schema);
module.exports = Users