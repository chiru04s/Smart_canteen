const express = require("express");
const { addFoodItem, upload } = require("../../controllers/Admin/addFoodItems");
const router = express.Router();

// Add Food Item Route with Image Upload
router.post("/", upload.single("image"), addFoodItem);

module.exports = router;
