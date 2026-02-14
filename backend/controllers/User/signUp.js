const User = require("../../models/User");

const signUp = async (req, res) => {
  const { name, department, identifier, role } = req.body;

  if (!name || !department || !identifier || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const newUser = new User({ name, department, identifier, role });
    await newUser.save();
    return res.status(200).json({ success: true, message: "Registration successful" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "User with this ID/Roll No already exists" });
    }
    console.error("Error registering user:", err);
    return res.status(500).json({ success: false, message: "Error registering user" });
  }
};

module.exports = { signUp };
