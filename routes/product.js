const express = require("express");
const productController = require("../controllers/product");

const auth = require("../auth");
const product = require("../models/product");

//const userConstroller = require("../controllers/user");

const {verify, verifyAdmin} = auth;

const router = express.Router();

router.post("/create", verify, verifyAdmin, productController.createProduct);

router.get("/all", verify, verifyAdmin, productController.getAllProduct);

router.get("/active", productController.getAllActive);

router.get("/:productId", productController.getProduct);

router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

router.put("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

router.put("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

router.delete("/:productId/delete", verify, verifyAdmin, productController.deleteProduct);

module.exports = router;