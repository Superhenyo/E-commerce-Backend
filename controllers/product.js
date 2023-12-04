const product = require("../models/product");
const Product = require("../models/product");
const User = require("../models/user");

module.exports.createProduct = (req, res) => {
    if (req.body.quantity <= 0){
        isActive = false
    } else {
        isActive = true
    }
    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        isActive: isActive
    })

    return newProduct.save().then((course, error) => {
        if(error){
            return res.send(false);
        } else {
            return res.send(true);
        }
    })
    .catch(err => res.send(err));
}

module.exports.getAllProduct = (req, res) => {
    return Product.find({}).then(result => {
        return res.send(result);
    })
    .catch(err => res.send(err));
}

module.exports.getAllActive = (req, res) => {
    return Product.find({isActive: true}).then(result => {
        return res.send(result);
    })
    .catch(error => res.send(error));
}

module.exports.getProduct = (req, res) => {
    return Product.findById(req.params.productId).then(result => {
        return res.send(result);
    })
    .catch(error => res.send(error))
}

module.exports.updateProduct = (req, res) => {

    let isActive = req.body.quantity <= 0 ? false : true;

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        isActive: isActive 
    }
    
    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then((result, error) => {
        if (error) {
            return res.send(false);
        } else {
            return res.send(true);
        }
    })
}

module.exports.archiveProduct = (req, res) => {
    let archiveProduct = {
        isActive: false
    }
    return Product.findByIdAndUpdate(req.params.productId, archiveProduct)
    .then((result, error) => {
        if(error){
            return res.send(false);
        } else {
            return res.send(true);
        }
    })
}

module.exports.activateProduct = async (req, res) => {

    let isActive =  await Product.findById(req.params.productId).then(result => {
        if (result.quantity <= 0){
            return res.send({ Failed: "0 quantity cant be active update 1st" });
        } else {
            return true
        }
    })

    let activeProduct = {
        isActive: isActive
    }

    return  await Product.findByIdAndUpdate(req.params.productId, activeProduct)
    .then((result, error) => {
        if(error){
            return res.send(false);
        } else {
            return res.send(true);
        }
    })
}