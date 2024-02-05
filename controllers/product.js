const Product = require("../models/product");
const User = require("../models/user");
const multer = require('multer');

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
        isActive: isActive,
        imageLink: req.body.imageLink
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
        imageLink: req.body.imageLink,
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
    const result = await Product.findById(req.params.productId);
    if (!result) {
        return res.status(404).send({ Failed: "Product not found" });
    }

    let isActive = false;

    if (result.quantity > 0) {
        isActive = true;
    } else {
        return res.status(400).send({ Failed: "0 quantity can't be active, update quantity first" });
    }

    const activeProduct = {
        isActive: isActive
    };

    try {
        await Product.findByIdAndUpdate(req.params.productId, activeProduct);
        return res.send(true);
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).send(false);
    }
};

module.exports.deleteProduct = (req, res) => {
    return Product.findByIdAndDelete(req.params.productId).then(result => {
        return res.send(true);
    }).catch(error => res.send(error))
};


