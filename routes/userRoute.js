const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const validateToken = require('../middlewares/validateToken')

//get user by id
router.get('/:id', validateToken, (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        User.find({_id: new mongoose.Types.ObjectId(id)})
        .then(user => {
            if(user.length==0) {
                console.log('Unable to fetch user');
                return res.status(404).send({message: 'No such user present'});
            }

            return res.status(200).send({userData: user})
        })
        .catch(err => console.log("Can't find", err))
    } catch (error) {
        console.log( "Not able to find" ,error);
    }
})

//update user by id
router.put('/:id', validateToken, (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    try {
        User.updateOne({_id: id}, {$set: req.body})
        .then(result => {
            if(result.matchedCount!=0)
                return res.status(200).send(result);
            
            return res.status(404).send({message: "No user found"})
        })
        .catch(err => console.log("Can't find", err))
    } catch (error) {
        console.log( "Not able to find" ,error);
    }
})

// login of user. First check if email exists then check if password matches and then send response.
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    User.findOne({email})
    .then(user => {
        if(user==null) {
            console.log("User not found");
            return res.status(404).send({message: "User not found"});
        }

        Bcrypt.compare(password, user.password)
        .then((matches) => {
            if(!matches) {
                return res.status(404).send({message: "Incorrect credentials"});
            }
            const token =  JWT.sign(
                { id: user._id },
                "secretkey"
            );
            const cookieOptions = {
                httpOnly: true
            }
    
            res.cookie('jwt', token, cookieOptions);
            console.log("User logged in");
            return res.status(200).send({user, token});
        })
        .catch(error => {
            return res.status(500).send({message: "Error occured"});
        })

        
    })
    .catch(error => {
        console.log('Error logging in user', error);
        res.send({message: "Error logging in user"});
    })
})

// signup user. Check is user already exists if not then create user using the form data. Hash password.
router.post('/signup', (req, res) => {
    try {

        User.findOne({email: req.body.email})
        .then(result => {
            if(result==null) {
                Bcrypt.hash(req.body.password, 12, (err, hash) => {
                    if(err!==undefined) {
                        console.log('Problem hashing password', err);
                        return res.status(500).send({message: "Problem occured"});
                    }
        
                    const user = new User({...req.body, password: hash});
                    user.save().then(data => {
                        return res.status(200).send({data});
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).send({message: "Unable to save user"});
                    })
                })
            } else {
                return res.status(500).send({message: "User already exists. Email is in use"});
            }
        })
        .catch(err => res.status(400).send({message: "Error occured", err}));

    } catch(error) {
        console.log("Error", error);
    }
    
});

router.get('/signout', (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/');
});

module.exports = router;