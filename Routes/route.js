const express = require("express");
const { newInventory, getInventory, handlePurchase } = require("../Controller/controller");
const uploadMultiple = require("../Middleware/multer");

const router = express.Router();

// Route to handle new inventory items
router.post("/newInventory", uploadMultiple, newInventory);

// Route to handle purchases via HTTP POST request
router.post("/handlePurchase", handlePurchase);

// Route to get all inventory items
router.get("/getInventory", getInventory);

module.exports = router;
