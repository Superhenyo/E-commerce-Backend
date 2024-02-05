const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required!"]
    },
    description:{
        type: String,
        required: [true, "Description is required!"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required!"]
    },
    price: {
        type: Number,
        required: [true, "Price is required!"]
    },
    imageLink: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    userOrder: [
        {
            userId: {
                type: String,
                required: [true, "userId is required"]
            },
            orderedOn: {
                type: Date,
                default: new Date()
            }

        }
    ]
})

module.exports = mongoose.model("Product", productSchema);