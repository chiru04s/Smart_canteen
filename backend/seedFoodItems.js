/**
 * ✅ Run this to add sample food items to MongoDB
 * Command: node seedFoodItems.js
 *
 * Only run once — or it will add duplicates.
 * You can also add items through the Admin Dashboard instead.
 */

const mongoose = require("mongoose");
const FoodItem = require("./models/FoodItem");

const MONGO_URI = "mongodb://localhost:27017/sac_snacks_wallet";

const sampleItems = [
  { name: "Idly", price: 20, quantity: 50, date: "2025-01-01", image_path: null },
  { name: "Dosa", price: 30, quantity: 40, date: "2025-01-01", image_path: null },
  { name: "Vada", price: 15, quantity: 60, date: "2025-01-01", image_path: null },
  { name: "Puff", price: 25, quantity: 30, date: "2025-01-01", image_path: null },
  { name: "Samosa", price: 20, quantity: 50, date: "2025-01-01", image_path: null },
  { name: "Tea", price: 10, quantity: 100, date: "2025-01-01", image_path: null },
];

async function seedFoodItems() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await FoodItem.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️  ${existing} food item(s) already exist. Skipping seed.`);
      console.log("   Delete them in Compass first if you want to re-seed.");
      process.exit(0);
    }

    await FoodItem.insertMany(sampleItems);
    console.log(`✅ ${sampleItems.length} food items added successfully!`);
    sampleItems.forEach(i => console.log(`   - ${i.name} @ ₹${i.price}`));
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seedFoodItems();
