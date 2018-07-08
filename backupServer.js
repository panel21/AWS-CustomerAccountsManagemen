const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var AWS = require('aws-sdk');
var ec2 = new AWS.EC2();
var iam = new AWS.IAM();
var opsworks = new AWS.OpsWorks();
var lightsail = new AWS.Lightsail();

const customer = require('./routes/customer.route');

mongoose.connect('mongodb://localhost/jwtauth');

const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:4200'
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors(corsOptions));

app.get('/checking', function(req, res){
    res.json({
        "Tutorial": "Welcome to the Node express JWT Tutorial"
    });
});

app.use('/customer', customer);

app.post('/aws/instance/getstate', (req, res) => {
    AWS.config.update({ region: req.body.region });
    var lightsail = new AWS.Lightsail({apiVersion: req.body.apiVersion});
    var params = {
        instanceName: req.body.instanceName
    };
    lightsail.getInstanceState(params, function(err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/aws/user/create', (req, res) => {
    var params = { 
        UserName: req.body.UserName
    };
    iam.createUser(params, function(err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/aws/user/getrolepolicy', (req, res) => {
    var params = {
        PolicyName: req.body.PolicyName,
        RoleName: req.body.RoleName
    };
    iam.getRolePolicy(params, function(err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/aws/user/getrole', (req, res) => {
    var params = {
        RoleName: req.body.RoleName
    };
    iam.getRole(params, function(err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/aws/user/get', (req, res) => {
    var params = { 
        UserName: req.body.UserName
    };
    iam.getUser(params, function(err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/aws/instance/stop', (req, res) => {
    // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
    // res.json(AWS.config, undefined, 2);
    // console.log(`TypeOf: ${typeof req.body.instanceIDs}`);
    AWS.config.update({ region: req.body.region });
    var params = { 
        InstanceIds: req.body.instanceIDs,
        DryRun: req.body.DryRun  
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    
    ec2.stopInstances(params, function (err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/aws/instance/start', (req, res) => {
    // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
    // res.json(AWS.config, undefined, 2);
    AWS.config.update({ region: req.body.region });
    var params = { 
        InstanceIds: req.body.instanceIDs,
        DryRun: req.body.DryRun
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    
    ec2.startInstances(params, function (err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/aws/instance/enlist', (req, res) => {
    // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
    // res.json(AWS.config, undefined, 2);
    AWS.config.update({ region: req.body.region });
    var params = { 
        InstanceIds: req.body.instanceIDs,
        DryRun: req.body.DryRun
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    ec2.describeInstanceStatus(params, function (err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/aws/instance/run', (req, res) => {
    // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
    // res.json(AWS.config, undefined, 2);
    AWS.config.update({ region: req.body.region });
    var params = { 
        InstanceIds: req.body.instanceIDs,
        DryRun: req.body.DryRun
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    ec2.runInstances(params, function (err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

// app.post('/aws/instance/delete', (req, res) => {
//     var params = { 
//         InstanceId: req.body.instanceId
//     };
//     opsworks.deleteInstance(params, function(err, data) {
//         if (err ) { return res.status(200).json(err) }
//         return res.json(data);
//     });
// });

app.post('/aws/instance/report', (req, res) => {
    // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
    // res.json(AWS.config, undefined, 2);
    AWS.config.update({ region: req.body.region });
    var params = { 
        Instances: req.body.instanceIDs,
        ReasonCodes: req.body.ReasonCodes,
        Status: req.body.Status,
        DryRun: req.body.DryRun,
        EndTime: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
        StartTime: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    ec2.reportInstanceStatus(params, function (err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json({data});
    });
});

app.post('/aws/instance/monitor', (req, res) => {
    // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
    // res.json(AWS.config, undefined, 2);
    AWS.config.update({ region: req.body.region });
    var params = { 
        InstanceIds: req.body.instanceIDs,
        DryRun: req.body.DryRun
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    ec2.monitorInstances(params, function (err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.post('/instance/unmonitor', (req, res) => {
    // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
    // res.json(AWS.config, undefined, 2);
    AWS.config.update({ region: req.body.region });
    var params = { 
        InstanceIds: req.body.instanceIDs,
        DryRun: req.body.DryRun
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    ec2.unmonitorInstances(params, function (err, data) {
        if (err ) { return res.status(200).json(err) }
        return res.json(data);
    });
});

app.listen(PORT, function(){
    console.log('Server is running on Port',PORT);
});