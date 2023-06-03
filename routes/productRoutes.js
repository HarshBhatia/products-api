const express = require("express");
const { searchProducts } = require("../controllers/productController");
const router = express.Router();

// Get all tasks
router.get("/search", searchProducts);

module.exports = router;
