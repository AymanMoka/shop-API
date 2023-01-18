const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { isValidObjectId } = require("mongoose");
module.exports = {
  async addNewProduct(req, res) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ message: "Category is invalid" });
    }
    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countlnStock: req.body.countlnStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    };
    Product.create(newProduct)
      .then((product) => {
        return res.status(200).json({ message: "Product Created" });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  },
  getAllProducts(req, res) {
    Product.find({})
      .select("name image category -_id")
      .populate("category")
      .then((products) => {
        return res.status(200).json({ products: products });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  },
  getProductById(req, res) {
    const productId = req.params.id;
    Product.findById(productId)
      .populate("category")
      .then((product) => {
        return res.status(200).json({ product: product });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  },
  async updateProduct(req, res) {
    if (req.body.category) {
      const categoryId = req.body.category;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Category is invalid" });
      }
    }
    const productId = req.params.id;
    Product.findByIdAndUpdate(
      productId,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countlnStock: req.body.countlnStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    )
      .then((product) => {
        return res.status(200).json({ product: product });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  },
};
