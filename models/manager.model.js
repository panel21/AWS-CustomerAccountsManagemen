const mongoose = require('mongoose');

const manager = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    birthDate: {type: Date, required: true},
    phoneNumber: {type: String, required: true},
    projectName: {type: String, required: true},
    companyName: {type: String, required: true},
    type: {type: String, require: true, default: "manager"},
    instances: [ {
        instanceId: {type: String},
        region: {type: String},
        role: {type: String},
        state: {type: String},
        INSTANCEDETAILS: {default: {}}
    } ],
    customers: [ String ]
});

module.exports = mongoose.model('Manager', manager);