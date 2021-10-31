const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    houseNo: {
        type: String
    },

    street: {
        type: String
    },

    colony: {
        type: String
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    pincode: {
        type: Number,
        required: true
    }
})

const PropertySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    basePrice: {
        type: String,
        required: true
    },

    facilities: {
        type: Array
    },

    imgUrl: {
        type: String,
        require: true
    },

    rating: {
        type: Number,
        default: 0
    },

    address: AddressSchema

})

module.exports = mongoose.model("Property", PropertySchema, 'property');
