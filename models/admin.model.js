const mongoose = require('mongoose');

const admin = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    instances: [ {
        instanceId: {type: String},
        runTime: {type: String},
        region: {type: String},
        role: {type: String},
        state: {type: String}
    } ]
    // birthDate: {type: Date, required: true},
    // phoneNumber: {type: String, required: true},
    // projectName: {type: String, required: true},
    // companyName: {type: String, required: true},
    // type: {type: String, require: true}
});

module.exports = mongoose.model('Admin', admin);
