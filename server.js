const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import { 
//     Stitch,
//     RemoteMongoClient,
//     AnonymousCredential
// } from "mongodb-stitch-browser-sdk";

// const client = Stitch.initializeDefaultAppClient('adminpanel-gkwxq');

// const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('adminPanelDB');

// client.auth.loginWithCredential(new AnonymousCredential()).then(user => 
//     db.collection('customers').updateOne({owner_id: client.auth.user.id}, {$set:{number:42}}, {upsert:true})
// ).then(() => 
// db.collection('customers').find({owner_id: client.auth.user.id}, { limit: 100}).asArray()
// ).then(docs => {
//     console.log("Found docs", docs)
//     console.log("[MongoDB Stitch] Connected to Stitch")
// }).catch(err => {
//     console.error(err)
// });


var AWS = require('aws-sdk');
var ec2 = new AWS.EC2();
var iam = new AWS.IAM();
var opsworks = new AWS.OpsWorks();
var lightsail = new AWS.Lightsail();

const admin = require('./routes/admin.route');
const customer = require('./routes/customer.route');
const manager = require('./routes/manager.route');
const aws = require('./routes/aws.route');
const path = require('path');

// mongoose.connect('mongodb://34.227.199.186/32/jwtauth');
// mongoose.connect('mongodb://admin:r00tr00t@ds131601.mlab.com:31601/aws');
// mongoose.connect('mongodb://localhost/jwtauth');
mongoose.connect('mongodb://panel21:12panel@ds235251.mlab.com:35251/awsaccountsmanagment');

const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:4200'
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/', (req, res) => {
//     res.render('index');
// });

app.get('/api/checking', function(req, res){
    res.json({
        "Tutorial": "Welcome to the Node express JWT Tutorial"
    });
});

app.use('/api/customer', customer);
app.use('/api/admin', admin);
app.use('/api/manager', manager);

app.use('/api/aws', aws);


// app.post('/aws/user/create', (req, res) => {
//     var params = { 
//         UserName: req.body.UserName
//     };
//     iam.createUser(params, function(err, data) {
//         if (err ) { return res.status(200).json(err) }
//         return res.json(data);
//     });
// });

// app.post('/aws/user/getrolepolicy', (req, res) => {
//     var params = {
//         PolicyName: req.body.PolicyName,
//         RoleName: req.body.RoleName
//     };
//     iam.getRolePolicy(params, function(err, data) {
//         if (err ) { return res.status(200).json(err) }
//         return res.json(data);
//     });
// });

// app.post('/aws/user/getrole', (req, res) => {
//     var params = {
//         RoleName: req.body.RoleName
//     };
//     iam.getRole(params, function(err, data) {
//         if (err ) { return res.status(200).json(err) }
//         return res.json(data);
//     });
// });

// app.post('/aws/user/get', (req, res) => {
//     var params = { 
//         UserName: req.body.UserName
//     };
//     iam.getUser(params, function(err, data) {
//         if (err ) { return res.status(200).json(err) }
//         return res.json(data);
//     });
// });

// app.post('/aws/instance/enlist', (req, res) => {
//     // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
//     // res.json(AWS.config, undefined, 2);
//     AWS.config.update({ region: req.body.region });
//     var params = { 
//         InstanceIds: req.body.instanceIDs,
//         DryRun: req.body.DryRun
//     };
//     ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
//     ec2.describeInstanceStatus(params, function (err, data) {
//         if (err ) { return res.status(200).json(err) }
//         return res.json(data);
//     });
// });

// // app.post('/aws/instance/delete', (req, res) => {
// //     var params = { 
// //         InstanceId: req.body.instanceId
// //     };
// //     opsworks.deleteInstance(params, function(err, data) {
// //         if (err ) { return res.status(200).json(err) }
// //         return res.json(data);
// //     });
// // });

// app.post('/aws/instance/monitor', (req, res) => {
//     // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
//     // res.json(AWS.config, undefined, 2);
//     AWS.config.update({ region: req.body.region });
//     var params = { 
//         InstanceIds: req.body.instanceIDs,
//         DryRun: req.body.DryRun
//     };
//     ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
//     ec2.monitorInstances(params, function (err, data) {
//         if (err ) { return res.status(200).json(err) }
//         return res.json(data);
//     });
// });

// app.post('/aws/instance/unmonitor', (req, res) => {
//     // console.log(`here: ${process.env.AWS_DEFAULT_REGION}`);
//     // res.json(AWS.config, undefined, 2);
//     AWS.config.update({ region: req.body.region });
//     var params = { 
//         InstanceIds: req.body.instanceIDs,
//         DryRun: req.body.DryRun
//     };
//     ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
//     ec2.unmonitorInstances(params, function (err, data) {
//         if (err ) { return res.status(200).json(err) }
//         return res.json(data);
//     });
// });

app.listen(PORT, function(){
    console.log('Server is running on Port',PORT);
});