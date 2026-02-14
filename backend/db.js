const mongoose = require('mongoose');

// ✅ Your MongoDB Compass connection string
// For LOCAL MongoDB (default): mongodb://localhost:27017/sac_snacks_wallet
// For MongoDB Atlas:           mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/sac_snacks_wallet

const MONGO_URI = "mongodb://localhost:27017/sac_snacks_wallet";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

