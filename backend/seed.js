/**
 * ✅ RUN THIS ONCE to create the Admin account in MongoDB
 * Command: node seed.js
 */

const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGO_URI = "mongodb://localhost:27017/sac_snacks_wallet";

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existing = await Admin.findOne({ AdminId: "sac2025" });
    if (existing) {
      console.log("ℹ️  Admin already exists. No action needed.");
      process.exit(0);
    }

    // Create admin  ← Change these values if needed
    await Admin.create({
      AdminId: "sac2025",
      AdminPassword: "admin123"
    });

    console.log("✅ Admin created successfully!");
    console.log("   AdminId:       sac2025");
    console.log("   AdminPassword: admin123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seedAdmin();
