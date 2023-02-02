const User = require("../models/userModel");
const Joi = require("joi");
const Bcrypt = require("bcryptjs");
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
      return res.status(400).json({ message: error.details[0].message });
    }
    const newMail = await User.findOne({ email: req.body.email.toLowerCase() });
    if (newMail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    return Bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: err.message });
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
            res.status(400).json({ message: "Invalid user data" });
          }
          res.status(201).json({ message: "user created", user: user });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    });
    },
    
    getUserList(req, res) {
        User.find({})
            .select("-password")
            .then((users) => {
            if (!users) {
                res.status(400).json({ message: "No users found" });
            }
            res.status(200).json({ message: "users found", users: users });
            })
            .catch((err) => {
            res.status(500).json({ message: err.message });
            });
    }
};
