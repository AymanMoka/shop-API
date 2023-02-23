const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/all", userController.getUserList);
router.put("/:id", userController.updateUser);

module.exports = router;
