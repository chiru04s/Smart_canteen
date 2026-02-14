const FoodItem = require("../../models/FoodItem");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Define the uploads directory relative to the backend folder
const uploadDir = path.join(__dirname, "../../uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Add Food Item Function
const addFoodItem = async (req, res) => {
  const { name, quantity, price, date } = req.body;
  const fileName = req.file ? req.file.filename : null;

  try {
    const newFoodItem = new FoodItem({ name, quantity, price, date, image_path: fileName });
    await newFoodItem.save();
    return res.send("Food item added successfully.");
  } catch (err) {
    console.error("Error adding food item:", err);
    return res.status(500).send("Error adding food item.");
  }
};

module.exports = {
  addFoodItem,
  upload,
};
