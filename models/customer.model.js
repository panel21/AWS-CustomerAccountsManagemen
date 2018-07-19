const mongoose = require('mongoose');

const customer = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    birthDate: {type: Date, required: true},
    phoneNumber: {type: String, required: true},
    projectName: {type: String, required: true},
    companyName: {type: String, required: true},
    type: {type: String, require: true, default: "customer"},
    instances: [ {
        instanceId: {type: String},
        runTime: {type: String},
        region: {type: String},
        role: {type: String},
        state: {type: String}
    } ]
});

module.exports = mongoose.model('Customer', customer);
