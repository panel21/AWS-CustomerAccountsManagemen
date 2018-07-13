const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');
const Admin = require('../models/admin.model');
const Manager = require('../models/manager.model');

router.post('/signin', function(req, res, next){
    Customer.findOne({email: req.body.email})
    .exec()
    .then(function(customer) {
        if (!customer) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, customer.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        const JWTToken = jwt.sign({
            email: customer.email,
            _id: customer._id
        },
        'secretMessage',
        {
            expiresIn: '2h'
        });
        return res.status(200).json({
            // success: 'Welcome to the JWT Auth',
            fullName: customer.fullName,
            token: JWTToken
        });
        
    })
    .catch(error => {
        res.status(500).json({
            error,
            message: `No customer found for: ${req.body.email}`
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

router.post('/signup', function(req, res, next) {
    // console.log("From server: "+JSON.stringify(req.body, undefined, 2));
    bcrypt.hash(req.body.password, 10, function(err, hash){
        if(err) {
            return res.status(500).json({
                err
            });
        }
        else {
            const customer = new Customer({
                _id: new  mongoose.Types.ObjectId(),
                fullName: req.body.fullName,
                password: req.body.password,
                email: req.body.email,
                birthDate: req.body.birthDate,
                phoneNumber: req.body.phoneNumber,
                projectName: req.body.projectName,
                companyName: req.body.companyName,
                instances: req.body.instances
            });
            customer.save().then(function(result) {
                // console.log(result);
                res.status(200).json({
                    success: 'New operator has been created'
                });
            }).catch(error => {
                res.status(500).json({
                    error
                });
            });
        }
    });
});

router.post('/mydata', function(req, res, next) {
    Customer.findOne({email: req.body.email})
    .exec()
    .then(function(customer) {
        if(!customer || customer.length == 0) {
            return res.status(404).json({ 
                message: `No operator found`
            })
        }
        return res.status(200).send(customer);        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });;
});

router.put('/updatepersonal', function(req, res, next) {
    // console.log(JSON.stringify(req.body, undefined, 2));
    Customer.findOne({email: req.body.email})
    .exec()
    .then(function(customer) {
        // console.log(JSON.stringify(req.body, undefined, 2));
        if(!customer) { 
            return res.status(404).json({ 
                message: `${req.body.type}  '${req.body.email}' not found!` 
            }) 
        }
        customer.fullName = req.body.fullName,
        customer.birthDate = req.body.birthDate,
        customer.phoneNumber = req.body.phoneNumber,
        customer.projectName = req.body.projectName,
        customer.companyName = req.body.companyName,
        customer.Types = req.body.type
        customer.save()
        .then(function(result) {
            if(!result) {
                return res.status(404).json({ 
                    message: `Unable to update customer!` 
                })
            }
            res.status(200).json({
                success: 'Operator has been updated'
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

router.post('/managertocustomer', function(req, res, next) {
    const customer = new Customer({
        _id: new  mongoose.Types.ObjectId(),
        fullName: req.body.fullName,
        password: req.body.password,
        email: req.body.email,
        birthDate: req.body.birthDate,
        phoneNumber: req.body.phoneNumber,
        projectName: req.body.projectName,
        companyName: req.body.companyName,
        instances: req.body.instances
    });
    customer.save().then(function(result) {
        // console.log(result);
        Manager.deleteOne({email: req.body.email})
        .exec()
        .then(function(result) {
            if(!result || result.n == 0) {
                return res.status(404).json({ 
                    message: `No such manager found`
                })
            }
            // res.status(200).json({
            //     result,
            //     message: `Manager deleted successfully`
            // });
            res.status(200).json({
                success: 'Operator has been downshifted'
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
    Customer.findOne({email: req.body.email})
    .exec()
    .then(function(customer) {
        if(!customer) { 
            return res.status(404).json({ 
                message: `User '${req.body.email}' not found!` 
            }) 
        }
        Admin.findOne({email: req.body.adminEmail})
        .exec()
        .then(function(admin) {
            if(!admin) {
                return res.status(404).json({ 
                    message: `Not an admin!` 
                }) 
            }
            if (!bcrypt.compareSync(req.body.adminPassword, admin.password)) {
                return res.status(401).json({
                    title: 'Unauthorized Access',
                    error: {message: 'Unauthorized access'}
                });
            }
            bcrypt.hash(req.body.newPassword, 10, function(err, hash){
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                customer.password = hash,
                customer.email = req.body.newEmail,
                customer.save()
                .then(function(result) {
                    if(!result) {
                        return res.status(404).json({ 
                            message: `Unable to update customer!` 
                        })
                    }
                    res.status(200).json({
                        success: 'Operator has been updated'
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
    Customer.findOne({email: req.body.email})
    .exec()
    .then(function(customer) {
        if(!customer) { 
            return res.status(404).json({ 
                message: `User '${req.body.email}' not found!` 
            }) 
        }
        customer.instances = req.body.instances;
        // console.log(customer.instances+"\n"+req.body.instances);
        customer.save()
        .then(function(result) {
            if(!result) {
                return res.status(404).json({ 
                    message: `Unable to update customer!` 
                })
            }
            res.status(200).json({
                success: 'Instances has been updated'
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
    Customer.find()
    .exec()
    .then(function(customers) {
        if(!customers || customers.length == 0) {
            return res.status(404).json({ 
                message: `No customer found`
            })
        }
        return res.status(200).json(customers);
    })
    .catch(error => {
        res.status(600).json({ error });
    });
});

router.post('/delete', function(req, res, next) {
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
});

module.exports = router;
