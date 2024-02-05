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
    imageLink: '',
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

  return User.findById(req.user.id).then(result => {

    result.password = "";

    return res.send(result);

  })
  .catch(error => res.send(error));
}

module.exports.allUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}, { password: 0 });
    res.send(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.getUser = (req, res) => {
    return User.findById(req.params.userId)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(result);
        })
        .catch(error => res.status(500).json({ error: error.message }));
};

module.exports.createOrder = async (req, res) => {

  if (req.user.isAdmin) {
    return res.status(403).send("Action Forbidden");
  }
  const user = await User.findById(req.user.id);
  const product = await Product.findById(req.body.productId);
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
  product.isActive = product.quantity > 0;

  // Save the updated product
  await product.save();

  // Send a success response
  res.send({ message: "successfull" });
}

module.exports.updateUser = (req, res) => {
  let newAdmin = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    isAdmin: req.body.isAdmin
  };

  User.findByIdAndUpdate(req.params.userId, newAdmin, { new: true })
     .then((result, error) => {
        if (error) {
            return res.send(false);
        } else {
            return res.send(true);
        }
    })
};

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

module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.changePhoto = async (req, res) => {
  try {
  const { newPhoto } = req.body;
  const { id } = req.user

  await User.findByIdAndUpdate(id, {imageLink: newPhoto});
  res.status(200).json({ message: 'Photo changePhoto'});
} catch(error){
  console.log(error);
  res.status(500).json({ message: `Internal Error ${error}`})
}
};

module.exports.deleteOrderedProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const productIndex = user.orderedProduct[0].products.findIndex(product => product._id.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Ordered product not found.' });
    }
    user.orderedProduct[0].products.splice(productIndex, 1);
    await user.save();

    return res.status(200).json({ success: true, message: 'Ordered product deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
};

module.exports.deleteUser= (req, res) => {
    return User.findByIdAndDelete(req.params.userId).then(result => {
        return res.send(true);
    }).catch(error => res.send(error))
};