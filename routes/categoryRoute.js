const express = require('express');
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.post('/add',categoryController.addCategory);
router.get('/all',categoryController.getAllCategories);
router.get('/:id',categoryController.getCategoryDetails);
router.put('/:id',categoryController.updateCategory);

module.exports = router;
