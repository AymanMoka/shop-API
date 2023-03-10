const Category = require("../models/categoryModel");
const { isValidObjectId } = require("mongoose");
const Http = require("http-status-codes");
module.exports = {
  async addCategory(req, res) {
    const newCategory = {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    };
    const invalid = await Category.findOne({
      $or: [
        { name: req.body.name },
        { icon: req.body.icon },
        { color: req.body.color },
      ],
    });
    if (invalid) {
      return res
        .status(Http.StatusCodes.CONFLICT)
        .json({ message: "Category Already Here" });
    }
    Category.create(newCategory)
      .then((category) => {
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "Category Created", category: category });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ err: err.message });
      });
  },
  deleteCategory(req, res) {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res
        .status(Http.StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid Id" });
    }
    Category.findOneAndDelete({ _id: id })
      .then((category) => {
        if (!category) {
          return res
            .status(Http.StatusCodes.NOT_FOUND)
            .json({ message: "Category not found" });
        }
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "Category Deleted" });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ err: err.message });
      });
  },
  getAllCategories(req, res) {
    Category.find({})
      .select("name")
      .then((categories) => {
        return res.status(Http.StatusCodes.OK).json({ categories: categories });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ err: err.message });
      });
  },
  getCategoryDetails(req, res) {
    const categoryId = req.params.id;
    if (!isValidObjectId(categoryId)) {
      return res
        .status(Http.StatusCodes.BAD_REQUEST)
        .json({ message: "Id not valid" });
    }
    Category.findOne({ _id: categoryId })
      .then((category) => {
        if (!category) {
          return res
            .status(Http.StatusCodes.NOT_FOUND)
            .json({ message: "Category not found" });
        }
        return res.status(Http.StatusCodes.OK).json({ category: category });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ err: err.message });
      });
  },
  async updateCategory(req, res) {
    const invalid = await Category.findOne({
      $or: [
        { name: req.body.name },
        { icon: req.body.icon },
        { color: req.body.color },
      ],
    });
    if (invalid) {
      return res
        .status(Http.StatusCodes.CONFLICT)
        .json({ message: "Category already here or not changed" });
    }
    const categoryId = req.params.id;
    if (!isValidObjectId(categoryId)) {
      return res
        .status(Http.StatusCodes.NOT_FOUND)
        .json({ message: "Id not valid" });
    }
    Category.findByIdAndUpdate(
      { _id: categoryId },
      {
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
      },
      {
        new: true,
      }
    )
      .then((category) => {
        if (!category) {
          return res
            .status(Http.StatusCodes.NOT_FOUND)
            .json({ message: "Category not found" });
        }
        return res.status(Http.StatusCodes.OK).json({ category: category });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ err: err.message });
      });
  },
};
