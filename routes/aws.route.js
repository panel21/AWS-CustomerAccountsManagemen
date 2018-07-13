const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var AWS = require('aws-sdk');
var ec2 = new AWS.EC2();
var iam = new AWS.IAM();
var opsworks = new AWS.OpsWorks();
var lightsail = new AWS.Lightsail();

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secretMessage', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: err
            });
        }
        next();
    })
});

router.post('/instance/getdescription', function(req, res, next) {
    // console.log(JSON.stringify(req.body, undefined, 2));
    AWS.config.update({ region: req.body.region });
    var params = { 
        InstanceIds: req.body.instanceIDs
        // DryRun: req.body.DryRun
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    ec2.describeInstances(params, function (err, data) {
        if (err ) { return res.status(200).json(err) }
        
        // var res = {
        //     InstanceId:      data.Reservations.Instances[0].InstanceId,
        //     InstanceType:    data.Reservations.Instances[0].InstanceType,
        //     Name:            data.Reservations.Instances[0].State.Name,
        //     ImageId:         data.Reservations.Instances[0].ImageId,
        //     KeyName:         data.Reservations.Instances[0].KeyName,
        //     Arn:             data.Reservations.Instances[0].IamInstanceProfile.Arn,
        //     PublicDnsName:   data.Reservations.Instances[0].NetworkInterfaces.Association.PublicDnsName,
        //     PublicIp:        data.Reservations.Instances[0].NetworkInterfaces.Association.PublicIp,
        //     PrivateDnsName:  data.Reservations.Instances[0].NetworkInterfaces.PrivateDnsName,
        //     PrivateIpAddress:data.Reservations.Instances[0].NetworkInterfaces.PrivateIpAddress,
        //     OwnerId:         data.Reservations.OwnerId,
        //     LaunchTime:      data.Reservations.Instances[0].LaunchTime
        // }
        // console.log(typeof data);
        
        return res.json(data);
    });
});

/* needs to be configured */
router.post('/instance/run', function(req, res, next) {
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

router.post('/instance/stop', function(req, res, next) {
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

router.post('/instance/start', function(req, res, next) {
    AWS.config.update({ region: req.body.region });
    var params = { 
        InstanceIds: req.body.instanceIDs,
        DryRun: req.body.DryRun
    };
    ec2 = new AWS.EC2({apiVersion: req.body.apiVersion});
    
    ec2.startInstances(params, function (err, data) {
        if (err) { return res.status(200).json(err) }
        return res.json(data);
    });
});

module.exports = router;