const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.post("/add", productController.addNewProduct);
router.get("/all", productController.getAllProducts);
router.get("/count", productController.productsCount);
router.get("/featured", productController.getFeaturedProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);


module.exports = router;
