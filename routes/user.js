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

router.post("/:userId/userDetails", verify, verifyAdmin, userController.getProfile);

router.post("/checkout", verify, userController.createOrder);

router.put("/createAdmin", verify, verifyAdmin, userController.createAdmin);

router.get("/myOrders", verify, userController.retrieveOrders);

router.get("/allOrders", verify, verifyAdmin, userController.allOrders);

router.post("/cart/addToCart", verify, userController.CartController.addToCart);

router.put("/cart/changeQuantity", verify, userController.CartController.changeQuantity);

router.delete("/cart/removeFromCart/:productId", verify, userController.CartController.removeFromCart);
router.get("/cart/getCartTotals", verify, userController.CartController.getCartTotals);

module.exports = router