const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.register);
router.get("/all", userController.getUserList);

module.exports = router;
