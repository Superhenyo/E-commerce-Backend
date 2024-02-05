const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required!"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"]
    },
    imageLink: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart:[ 
     {
        item:[
            { 
            productId: {
                type: String,
                required: [true, "ID is needed"]
            },
            productName: {
                type: String,
                required: [true, "Name is required!"]
            },
            quantity: {
                type: Number,
                required: [true, "Number is required!"]
            },
            subtotal: {
                type: Number
            }
        }],
        totalAmount: {
            type: Number,
            default: 0
        }    
     }
    ],
    orderedProduct: [
        {
            products: [
                {
                    productId: {
                        type: String,
                        required: [true, "Product ID is required!"]
                    },
                    productName: {
                        type: String,
                        required: [true, "Product name is required!"]
                    },
                    quantity: {
                        type: Number,
                        required: [true, "Order quantity is required!"]
                    },
                    payables: {
                        type: Number
                    }
                }
            ],
            totalAmount: {
                type: Number,
                default: 0
            },
            purchaseOn: {
                type: Date,
                default: new Date()
            }
        }
    ]
});

module.exports = mongoose.model("User", userSchema);
