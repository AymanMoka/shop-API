const User = require("../models/userModel");
const Joi = require("joi");
const Bcrypt = require("bcryptjs");
const { isValidObjectId } = require("mongoose");
const Http = require("http-status-codes");
const Jwt = require("jsonwebtoken");
module.exports = {
  async register(req, res) {
    const userSchmea = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
      street: Joi.string().min(3).max(30),
      zip: Joi.string().min(3).max(30),
      apartment: Joi.string().min(3).max(30),
      city: Joi.string().min(3).max(30),
      country: Joi.string().min(3).max(30),
      phone: Joi.number().required(),
      isAdmin: Joi.boolean(),
    });
    const { error } = userSchmea.validate(req.body);
    if (error) {
      return res
        .status(Http.StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }
    const newMail = await User.findOne({ email: req.body.email.toLowerCase() });
    if (newMail) {
      return res
        .status(Http.StatusCodes.CONFLICT)
        .json({ message: "Email already exists" });
    }

    return Bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
      const newUser = {
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: hash,
        street: req.body.street,
        zip: req.body.zip,
        apartment: req.body.apartment,
        city: req.body.city,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
      };
      User.create(newUser)
        .then((user) => {
          if (!user) {
            res
              .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: "Invalid user data" });
          }
          const token = Jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          res
            .status(Http.StatusCodes.CREATED)
            .json({ message: "user created", token: token });
        })
        .catch((err) => {
          res
            .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
        });
    });
  },

  login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res
        .status(Http.StatusCodes.BAD_REQUEST)
        .json({ message: "email and password are required" });
    }
    User.findOne({ email: req.body.email.toLowerCase() })
      .then(async (user) => {
        if (!user) {
          return res
            .status(Http.StatusCodes.NOT_FOUND)
            .json({ message: "Invalid email" });
        }
        const validPassword = await Bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validPassword) {
          return res
            .status(Http.StatusCodes.NOT_FOUND)
            .json({ message: "Invalid password" });
        }
        const token = Jwt.sign(
          { userId: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "login successful", token: token });
      })
      .catch((err) => {
        res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },

  getUserList(req, res) {
    User.find({})
      .select("-password")
      .then((users) => {
        if (!users) {
          res
            .status(Http.StatusCodes.NOT_FOUND)
            .json({ message: "No users found" });
        }
        res
          .status(Http.StatusCodes.OK)
          .json({ message: "users found", users: users });
      })
      .catch((err) => {
        res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  },

  async updateUser(req, res) {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res
        .status(Http.StatusCodes.NOT_FOUND)
        .json({ message: "Invalid user id" });
    }

    const currentUser = await User.findById(id);
    let newPassword;
    if (req.body.password) {
      newPassword = await Bcrypt.hash(req.body.password, 10);
    } else {
      newPassword = currentUser.password;
    }

    const updatedUser = await User.findOneAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: newPassword,
        street: req.body.street,
        zip: req.body.zip,
        apartment: req.body.apartment,
        city: req.body.city,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Invalid user data" });
    }
    res
      .status(Http.StatusCodes.OK)
      .json({ message: "user updated", user: updatedUser });
  },
};
