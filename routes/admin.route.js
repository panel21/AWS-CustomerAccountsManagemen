const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const Customer = require('../models/customer.model');
const Manager = require('../models/manager.model');

router.post('/signin', function(req, res, next){
    Admin.findOne({email: req.body.email})
    .exec()
    .then(function(admin) {
        if(!admin) { 
            return res.status(404).json({ 
                message: `Admin with email '${req.body.email}' not found!` 
            }) 
        }
        if (!bcrypt.compareSync(req.body.password, admin.password)) {
            return res.status(401).json({
                title: 'Unauthorized Access',
                error: {message: 'Invalid credentials'}
            });
        }
        const JWTToken = jwt.sign({
            email: admin.email,
            _id: admin._id
        },'secretMessage', { expiresIn: '2h' });
        return res.status(200).json({
            // success: 'Welcome to the JWT Auth',
            fullName: admin.fullName,
            token: JWTToken
        });
        
    })
    .catch(error => {
        res.status(500).json({
            error,
            // message: `No accound found for: ${req.body.email}`
            message: `Invalid credentials!`
        });
    });
});

router.post('/signup', function(req, res, next) {
    // console.log("From server: "+JSON.stringify(req.body, undefined, 2));
    bcrypt.hash(req.body.password, 10, function(err, hash){
        if(err) {
            return res.status(500).json({
                err
            });
        }
        else {
            const admin = new Admin({
                _id: new  mongoose.Types.ObjectId(),
                fullName: req.body.fullName,
                password: hash,
                email: req.body.email,
                instanceId: req.body.instanceId
            });
            admin.save().then(function(result) {
                // console.log(result);
                res.status(200).json({
                    success: 'New admin has been created'
                });
            }).catch(error => {
                res.status(500).json({
                    error
                });
            });
        }
    });
});

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

router.put('/updateinstances', function(req, res, next) {
    Admin.findOne({email: req.body.email})
    .exec()
    .then(function(admin) {
        if(!admin) { 
            return res.status(404).json({ 
                message: `User '${req.body.email}' not found!` 
            }) 
        }
        admin.instances = req.body.instances
        admin.save()
        .then(function(result) {
            if(!result) {
                return res.status(404).json({ 
                    message: `Unable to update admin!` 
                })
            }
            res.status(200).json({
                success: 'Admin has been updated'
            });
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });;
});

router.post('/mydata', function(req, res, next) {
    Admin.findOne({email: req.body.email})
    .exec()
    .then(function(admin) {
        if(!admin || admin.length == 0) {
            return res.status(404).json({ 
                message: `No admin found`
            })
        }
        return res.status(200).json(admin);        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });;
});

// router.put('/updatepersonal', function(req, res, next) {
//     Admin.findOne({email: req.body.email})
//     .exec()
//     .then(function(admin) {
//         if(!admin) { 
//             return res.status(404).json({ 
//                 message: `Admin with email '${req.body.email}' not found!` 
//             }) 
//         }
//         if (!bcrypt.compareSync(req.body.adminOldPassword, admin.password)) {
//             return res.status(401).json({
//                 title: 'Unauthorized Access',
//                 error: {message: 'Invalid credentials'}
//             });
//         }
//         var newEmail = req.body.newEmail;
//         var fullName = req.body.fullName;
//         var password = req.body.password;
//         admin.fullName = fullName == undefined || fullName.trim() === '' ? admin.fullName : fullName;
//         admin.password = password == undefined || password.trim() === '' ? admin.password : password;
//         admin.email = newEmail == undefined || newEmail.trim() === '' ? admin.email : newEmail;
//         admin.save()
//         .then(function(result) {
//             if(!result) {
//                 return res.status(404).json({ 
//                     message: `Unable to update admin!`
//                 })
//             }
//             res.status(200).json({
//                 success: 'Admin has been updated'
//             });
//         })
//         .catch(error => {
//             res.status(500).json({
//                 error: "Here while updating admin: "+error
//             });
//         });
//     })
//     .catch(error => {
//         res.status(500).json({
//             error: error
//         });
//     });;
// });

router.put('/updatepassword', function(req, res, next) {
    // console.log(JSON.stringify(req.body, undefined, 2));
    Admin.findOne({email: req.body.oldEmail})
    .exec()
    .then(function(admin) {
        if(!admin) { 
            return res.status(404).json({ 
                message: `Admin '${req.body.oldEmail}' not found!` 
            }) 
        }
        if (!bcrypt.compareSync(req.body.oldPassword, admin.password)) {
            return res.status(401).json({
                title: 'Unauthorized Access',
                error: {message: 'Invalid credentials'}
            });
        }
        bcrypt.hash(req.body.newPassword, 10, function(err, hash){
            // if(err) {
            //     return res.status(500).json({
            //         error: err + ""
            //     });
            // }
            // admin.password = hash;
            var newEmail = req.body.newEmail;
            var fullName = req.body.fullName;
            var password = req.body.newPassword;
            admin.fullName = fullName == undefined || fullName.trim() === '' ? admin.fullName : fullName;
            admin.password = password == undefined || password.trim() === '' ? admin.password : hash;
            admin.email = newEmail == undefined || newEmail.trim() === '' ? admin.email : newEmail;
            // console.log(JSON.stringify(admin, undefined, 2));
            admin.save()
            .then(function(result) {
                if(!result) {
                    return res.status(404).json({ 
                        message: `Unable to update admin!`
                    })
                }
                res.status(200).json({
                    success: 'Admin has been updated'
                });
            })
            .catch(error => {
                res.status(500).json({
                    error: "Here while updating admin: "+error
                });
            });
        });
    })
    .catch(error => {
        res.status(500).json({
            error: error+" Here while.."
        });
    });;
});

router.post('/delete', function(req, res, next) {
    Admin.deleteOne({email: req.body.email})
    .exec()
    .then(function(result) {
        if(!result || result.n == 0) {
            return res.status(404).json({ 
                message: `No such admin found`
            })
        }
        res.status(200).json({
            result,
            message: `Admin deleted successfully`
        });
    })
    .catch(error => {
        res.status(500).json({
            message: error
        });
    });
});

router.get('/getalldata', function(req, res, next) {
    Customer.find()
    .exec()
    .then(function(customers) {
        if(!customers || customers.length == 0) {
            return res.status(404).json({ 
                message: `No customer found`
            })
        }
        Manager.find()
        .exec()
        .then(function(managers) {
            if(!managers || managers.length == 0) {
                return res.status(404).json({ 
                    message: `No manager found`
                })
            }
            return res.status(200).send({customers, managers});
        })
        .catch(error => {
            res.status(600).json({ error });
        });
    })
    .catch(error => {
        res.status(600).json({ error });
    });
});

module.exports = router;
