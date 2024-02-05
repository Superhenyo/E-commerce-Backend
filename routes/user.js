const express = require("express");
const auth = require("../auth");
const userController = require("../controllers/user");

const {verify, verifyAdmin} = auth;

const router = express.Router();

router.post("/checkEmail", (req, res) => {
    userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});

router.post("/register", (req, res) => {
    userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});

router.post("/login", userController.loginUser);

router.get("/userDetails", verify, userController.getProfile);

router.put('/changePhoto', verify, userController.changePhoto);

router.get("/allUsers", verify, verifyAdmin, userController.allUsers);

router.put('/reset-password', verify, userController.resetPassword);

router.post("/checkout", verify, userController.createOrder);

router.get("/:userId", userController.getUser);

router.put("/:userId", verify, verifyAdmin, userController.updateUser);

router.get("/myOrders", verify, userController.retrieveOrders);

router.get("/allOrders", verify, verifyAdmin, userController.allOrders);

router.post("/cart/addToCart", verify, userController.CartController.addToCart);

router.put("/cart/changeQuantity", verify, userController.CartController.changeQuantity);

router.delete("/cart/removeFromCart/:productId", verify, userController.CartController.removeFromCart);

router.get("/cart/getCartTotals", verify, userController.CartController.getCartTotals);

router.delete("/removeProduct/:userId/:productId", userController.deleteOrderedProduct);

router.delete("/:userId/delete", verify, verifyAdmin, userController.deleteUser);

module.exports = router