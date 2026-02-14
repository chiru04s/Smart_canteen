const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./db");
const adminAuth = require("./routes/Admin/adminLogin");
const addCaterer = require("./routes/Admin/addCaterer");
const catererList = require("./routes/Admin/catererList");
const deleteCaterer = require("./routes/Admin/deleteCaterer");
const addFoodItems = require("./routes/Admin/addFoodItems");
const signUp = require("./routes/User/signUp");
const login = require("./routes/User/login");
const homePage = require("./routes/User/homepage");
const orders = require("./routes/orders");

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json()); // Parse JSON requests
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
// Serves the images to frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/admin", adminAuth);                               // Admin authentication routes
app.use("/admin/dashboard/addCaterer", addCaterer);        // Admin Adding caterer
app.use("/admin/dashboard/catererList", catererList);      // Admin seeing caterer list
app.use("/admin/dashboard/catererList", deleteCaterer);
app.use("/admin/dashboard/foodItems", addFoodItems);
app.use("/signup", signUp);                                 // Creating Users
app.use("/login", login);                                   // User Login
app.use("/homepage", homePage);
app.use("/orders", orders);                                // Order management

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, "public", "error.html"));
});

// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
});

