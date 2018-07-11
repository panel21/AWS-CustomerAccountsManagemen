const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Manager = require('../models/manager.model');
const Admin = require('../models/admin.model');
const Customer = require('../models/customer.model');

router.post('/signin', function(req, res, next){
    Manager.findOne({email: req.body.email})
    .exec()
    .then(function(manager) {
        if(!manager) { 
            return res.status(404).json({ 
                message: `Manager with email '${req.body.email}' not found!` 
            }) 
        }
        if (!bcrypt.compareSync(req.body.password, manager.password)) {
            return res.status(401).json({
                title: 'Unauthorized Access',
                error: {message: 'Invalid credentials'}
            });
        }
        const JWTToken = jwt.sign({
            email: manager.email,
            _id: manager._id
        },
        'secretMessage',
        {
            expiresIn: '2h'
        });
        return res.status(200).json({
            // success: 'Welcome to the JWT Auth',
            fullName: manager.fullName,
            token: JWTToken
        });
        
    })
    .catch(error => {
        res.status(500).json({
            error,
            // message: `No manager found for: ${req.body.email}`
            message: `Invalid credentials!`
        });
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

router.post('/mydata', function(req, res, next) {
    Manager.findOne({email: req.body.email})
    .exec()
    .then(function(manager) {
        if(!manager || manager.length == 0) {
            return res.status(404).json({ 
                message: `No manager found`
            })
        }
        return res.status(200).send(manager);        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });;
});

router.post('/signup', function(req, res, next) {
    bcrypt.hash(req.body.password, 10, function(err, hash){
        if(err) {
            return res.status(500).json({
                err
            });
        }
        else {
            const manager = new Manager({
                _id: new  mongoose.Types.ObjectId(),
                fullName: req.body.fullName,
                password: hash,
                email: req.body.email,
                birthDate: req.body.birthDate,
                phoneNumber: req.body.phoneNumber,
                projectName: req.body.projectName,
                companyName: req.body.companyName,
                instances: req.body.instances,
                customers: req.body.customers,
                type: req.body.type
            });
            manager.save().then(function(result) {
                res.status(200).json({
                    success: 'New manager has been created'
                });
            }).catch(error => {
                res.status(500).json({
                    error
                });
            });
        }
    });
});

router.put('/updatepersonal', function(req, res, next) {
    Manager.findOne({email: req.body.email})
    .exec()
    .then(function(manager) {
        // console.log(JSON.stringify(req.body, undefined, 2));
        if(!manager) { 
            return res.status(404).json({ 
                message: `${req.body.type} '${req.body.email}' not found!` 
            }) 
        }
        manager.fullName = req.body.fullName,
        manager.birthDate = req.body.birthDate,
        manager.phoneNumber = req.body.phoneNumber,
        manager.projectName = req.body.projectName,
        manager.companyName = req.body.companyName,
        manager.type = req.body.type
        manager.save()
        .then(function(result) {
            if(!result) {
                return res.status(404).json({ 
                    message: `Unable to update manager!` 
                })
            }
            res.status(200).json({
                success: 'Manager has been updated'
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

router.post('/customertomanager', function(req, res, next) {
    const manager = new Manager({
        _id: new  mongoose.Types.ObjectId(),
        fullName: req.body.fullName,
        password: req.body.password,
        email: req.body.email,
        birthDate: req.body.birthDate,
        phoneNumber: req.body.phoneNumber,
        projectName: req.body.projectName,
        companyName: req.body.companyName,
        instances: req.body.instances,
        customers: []
    });
    manager.save().then(function(result) {
        // console.log(result);
        res.status(200).json({
            success: 'Customer has been upshifted'
        });
        Customer.deleteOne({email: req.body.email})
        .exec()
        .then(function(result) {
            if(!result || result.n == 0) {
                return res.status(404).json({ 
                    message: `No such customer found`
                })
            }
            res.status(200).json({
                result,
                message: `User deleted successfully`
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error
            });
        });
    }).catch(error => {
        res.status(500).json({
            error
        });
    });
});

router.put('/updatepassword', function(req, res, next) {
    Manager.findOne({email: req.body.email})
    .exec()
    .then(function(manager) {
        if(!manager) { 
            return res.status(404).json({ 
                message: `User '${req.body.email}' not found!` 
            }) 
        }
        Admin.findOne({email: req.body.adminEmail})
        .exec()
        .then(function(admin) {
            if(!admin) {
                return res.status(404).json({ 
                    message: `Admin not found!` 
                }) 
            }
            if (!bcrypt.compareSync(req.body.adminPassword, admin.password)) {
                return res.status(401).json({
                    title: 'Unauthorized Access',
                    error: {message: 'Invalid credentials'}
                });
            }
            bcrypt.hash(req.body.newPassword, 10, function(err, hash){
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                manager.password = hash,
                manager.email = req.body.newEmail,
                manager.save()
                .then(function(result) {
                    if(!result) {
                        return res.status(404).json({ 
                            message: `Unable to update manager!` 
                        })
                    }
                    res.status(200).json({
                        success: 'Manager has been updated'
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        error
                    });
                });
            }); 
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });;
});

router.put('/updateinstances', function(req, res, next) {
    Manager.findOne({email: req.body.email})
    .exec()
    .then(function(manager) {
        if(!manager) { 
            return res.status(404).json({ 
                message: `User with email '${req.body.email}' not found!` 
            }) 
        }
        manager.instances = req.body.instances
        manager.save()
        .then(function(result) {
            if(!result) {
                return res.status(404).json({ 
                    message: `Unable to update manager!` 
                })
            }
            res.status(200).json({
                success: 'Manager has been updated'
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

router.put('/updatecustomers', function(req, res, next) {
    Manager.findOne({email: req.body.managerEmail})
    .exec()
    .then(function(manager) {
        if(!manager) { 
            return res.status(404).json({ 
                message: `Manager '${req.body.managerEmail}' not found!`,
                typeNotFound: `Manager`
            }) 
        }
        manager.customers = req.body.customers
        manager.save()
        .then(function(result) {
            if(!result) {
                return res.status(404).json({ 
                    message: `Unable to update manager!` 
                })
            }
            res.status(200).json({
                success: 'Manager has been updated'
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

router.get('/enlist', function(req, res, next) {
    Manager.find()
    .exec()
    .then(function(managers) {
        if(!managers || managers.length == 0) {
            return res.status(404).json({ 
                message: `No manager found`
            })
        }
        return res.status(200).json(managers);
    })
    .catch(error => {
        res.status(600).json({ error });
    });
});

router.post('/delete', function(req, res, next) {
    Manager.deleteOne({email: req.body.email})
    .exec()
    .then(function(result) {
        if(!result || result.n == 0) {
            return res.status(404).json({ 
                message: `No such manager found`
            })
        }
        res.status(200).json({
            result,
            message: `Manager deleted successfully`
        });
    })
    .catch(error => {
        res.status(500).json({
            message: error
        });
    });
});

router.post('/deletecustomer', function(req, res, next) {
    Manager.update({}, {$pull: {customers: {$in : [req.body.email]}}}, {multi: true})
    .exec()
    .then(function(result) {
        // console.log(JSON.stringify(result, undefined, 2));
        if(!result || result.n == 0) {
            return res.status(404).json({ 
                message: `No such customer found`
            })
        }
        res.status(200).json({
            result,
            message: `Customers deleted successfully`
        });
    })
    .catch(error => {
        res.status(500).json({
            message: error
        });
    });
});

module.exports = router;
