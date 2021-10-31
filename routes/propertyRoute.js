const express = require('express');
const router = express.Router();
const Property = require('../models/propertyModel');
const mongoose = require('mongoose');
const validateToken = require('../middlewares/validateToken')

//get property by id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        Property.findOne({_id: new mongoose.Types.ObjectId(id)})
        .then(property => {
            if(property.length==0) {
                console.log('Unable to fetch property');
                return res.status(404).send({message: 'No such property present'});
            }

            return res.status(200).send(property)
        })
        .catch(err => console.log("Can't find", err))
    } catch (error) {
        console.log( "Not able to find" ,error);
    }
})

router.get('/', (req, res) => {
    try {
        Property.find({})
        .then(properties => {
            if(properties.length==0) {
                console.log('Unable to fetch property');
                return res.status(404).send({message: 'No such property present'});
            }

            return res.status(200).send(properties)
        })
        .catch(err => console.log("Can't find", err))
    } catch (error) {
        console.log( "Not able to find" ,error);
    }
})

//update user by id
// router.put('/:id', validateToken, (req, res) => {
//     const id = mongoose.Types.ObjectId(req.params.id);
//     try {
//         User.updateOne({_id: id}, {$set: req.body})
//         .then(result => {
//             if(result.matchedCount!=0)
//                 return res.status(200).send(result);
            
//             return res.status(404).send({message: "No user found"})
//         })
//         .catch(err => console.log("Can't find", err))
//     } catch (error) {
//         console.log( "Not able to find" ,error);
//     }
// })

router.post('/add', (req, res) => {
    try {
        const property = new Property({...req.body});
        property.save().then(data => {
            return res.status(200).send({data});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: "Unable to save property"});
        })
    } catch(error) {
        console.log("Error", error);
    }
});

module.exports = router;