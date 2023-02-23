const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { isValidObjectId } = require("mongoose");
const Http = require("http-status-codes");
module.exports = {
  async addNewProduct(req, res) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res
        .status(Http.StatusCodes.BAD_REQUEST)
        .json({ message: "Category is invalid" });
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
        return res
          .status(Http.StatusCodes.CREATED)
          .json({ message: "Product Created" });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },
  getAllProducts(req, res) {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    Product.find(filter)
      .select("name image category price")
      .populate("category")
      .then((products) => {
        return res.status(Http.StatusCodes.OK).json({ products: products });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },
  getProductById(req, res) {
    const productId = req.params.id;
    Product.findById(productId)
      .populate("category")
      .then((product) => {
        return res.status(Http.StatusCodes.OK).json({ product: product });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },
  async updateProduct(req, res) {
    if (req.body.category) {
      const categoryId = req.body.category;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res
          .status(Http.StatusCodes.NOT_FOUND)
          .json({ message: "Category is invalid" });
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
        return res.status(Http.StatusCodes.OK).json({ product: product });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },

  deleteProduct(req, res) {
    const productId = req.params.id;
    if (!isValidObjectId(productId)) {
      return res
        .status(Http.StatusCodes.NOT_FOUND)
        .json({ message: "Product Id is not valid" });
    }
    Product.findByIdAndDelete(productId)
      .then((product) => {
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "Product deleted" });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },

  productsCount(req, res) {
    Product.countDocuments({})
      .then((result) => {
        return res.status(Http.StatusCodes.OK).json({ count: result });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },
  getFeaturedProducts(req, res) {
    Product.find({ isFeatured: true })
      .populate("category")
      .then((products) => {
        return res
          .status(Http.StatusCodes.OK)
          .json({ featured_products: products });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },
};
