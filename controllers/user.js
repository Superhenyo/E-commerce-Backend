const bcrypt = require("bcrypt");
const auth = require("../auth");
const User = require("../models/user");
const Product = require("../models/product");

module.exports.checkEmailExists = (reqbody) => {
  return User.find({ email: reqbody.email }).then(result => {
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  })
}

module.exports.registerUser = (reqBody) => {
  let newUser = new User({
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.password, 10)
  });
  return newUser.save().then((user, error) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  })
}

module.exports.loginUser = (req, res) => {
  return User.findOne({ email: req.body.email }).then(result => {
    if (result == null) {
      return res.send(false);
    } else {
      const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

      if (isPasswordCorrect) {
        return res.send({ access: auth.createAccessToken(result) })
      } else {
        return res.send(false)
      }
    }
  })
}

module.exports.getProfile = (req, res) => {
  return User.findById(req.params.userId).then(result => {

    result.password = "";
    return res.send(result);
  })
    .catch(error => res.send(error));
}

module.exports.createOrder = async (req, res) => {
  if (req.user.isAdmin) {
    return res.status(403).send("Action Forbidden");
  }

  // Find the user by ID
  const user = await User.findById(req.user.id);

  // Find the product by ID
  const product = await Product.findById(req.body.productId);

  // Check if the product is found
  if (!product) {
    return res.status(404).send("Product not found");
  }

  // Update user's orderedProduct
  let newOrder = {
    productId: req.body.productId,
    productName: product ? product.name : null,
    quantity: Math.min(req.body.quantity, product.quantity)
  };

  if (!user.orderedProduct[0] || typeof user.orderedProduct[0] !== 'object') {
    user.orderedProduct[0] = {
      products: [newOrder]
    };
  } else if (Array.isArray(user.orderedProduct[0].products)) {
    user.orderedProduct[0].products.push(newOrder);
  }

  // Save the updated user
  await user.save();

  // Update product's userOrder and quantity
  let buyer = {
    userId: req.user.id,
  };

  product.userOrder.push(buyer);
  product.quantity -= req.body.quantity;

  // Save the updated product
  await product.save();

  // Send a success response
  res.send({ message: "Order placed successfully" });
}
module.exports.createAdmin = (req, res) => {
  let newAdmin = {
    isAdmin: req.body.isAdmin
  }
  return User.findByIdAndUpdate(req.body.id, newAdmin).then((result, error) => {
    if (error) {
      return res.send(false);
    } else {
      return res.send(true);
    }
  })
}

module.exports.retrieveOrders = (req, res) => {
  return User.findById(req.user.id).then(result => {
    return res.send(result.orderedProduct);
  })
}
module.exports.allOrders = (req, res) => {
  return Product.find({}).then(result => {
    let ordersArray = [];
    result.forEach(product => {
      if (product.userOrder.length > 0) {
        ordersArray.push(...product.userOrder);
      }
    });
    res.send(ordersArray);
  })
    .catch(err => res.send(err))
}

module.exports.CartController = {
  addToCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const product = await Product.findById(req.body.productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      const newCartItem = {
        productId: req.body.productId,
        productName: product ? product.name : null,
        quantity: Math.min(req.body.quantity, product.quantity),
        subtotal: product.price * req.body.quantity,
      };

      if (!user.cart[0] || typeof user.cart[0] !== 'object') {
        user.cart[0] = {
          products: [newCartItem]
        };
      } else if (Array.isArray(user.cart[0].item)) {
        user.cart[0].item.push(newCartItem);
      }

      user.cart[0].item.push(newCartItem);
      user.cart[0].totalAmount += newCartItem.subtotal;

      await user.save();

      console.log("After user save:", req.user); // Add this line for debugging

      res.json({
        newCartItem,
        message: "Product added to cart successfully"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  changeQuantity: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      // Find the correct cart item based on productId
      const cartItem = user.cart[0].item.find(item => item.productId === req.body.productId);
  
      if (!cartItem) {
        return res.status(404).json({ error: "Product not found in the cart" });
      }
  
      // Assuming productId is the correct property, not a method
      const product = await Product.findOne({ _id: cartItem.productId });
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      const previousSubtotal = cartItem.subtotal;
  
      cartItem.quantity = req.body.quantity;
      cartItem.subtotal = product.price * req.body.quantity;
  
      // Assuming cart is an array, not an object with a totalAmount property
      user.cart[0].totalAmount += cartItem.subtotal - previousSubtotal;
  
      await user.save();
  
      res.json({ message: "Quantity updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  
  removeFromCart: async (req, res) => {
    try {
      const productId = req.params.productId;

      const user = await User.findById(req.user.id);
  
      // Find the correct cart item based on productId
      const cartItem = user.cart[0].item.find((item) => item.productId === productId);
      
      if (!cartItem) {
        return res.status(404).json({ error: "Product not found in the cart" });
      }
  
      const product = await Product.findOne({ _id: cartItem.productId });
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Subtract the removed item's subtotal from the totalAmount
      user.cart[0].totalAmount -= cartItem.subtotal;
  
      // Filter out the item to be removed
      user.cart[0].item = user.cart[0].item.filter((item) => item.productId !== productId);
  
      await user.save();
  
      res.json({ message: "Product removed from cart successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getCartTotals: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const cart = user.cart[0].item;
      
      // Create a deep copy of the cart items to avoid modifying the original objects
      const cartWithSubtotals = cart.map((item) => ({ ...item }));
  
      const totalPrice = user.cart[0].totalAmount;
  
      res.json({ totalPrice });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

}