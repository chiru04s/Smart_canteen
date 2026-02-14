const FoodItem = require("../../models/FoodItem");

const homePage = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({});

    // ✅ FIX: Always return 200, even if empty — never return 404
    // A 404 causes axios to throw an error on the frontend
    return res.status(200).json({
      success: true,
      message: foodItems.length === 0 ? "No food items added yet" : "Success",
      data: foodItems,
    });

  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching food items",
      error: err,
    });
  }
};

module.exports = { homePage };
