const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');

const login = async (req, res) => {
  const { AdminId, AdminPassword } = req.body;
  console.log(AdminId, AdminPassword);

  try {
    // Find admin by ID and Password in MongoDB
    const admin = await Admin.findOne({ AdminId, AdminPassword });

    if (admin) {
      const token = jwt.sign({ AdminId: 'sac2025', role: 'admin' }, "samosa", { expiresIn: '1h' });
      return res.json({ success: true, token, role: 'admin' });
    } else {
      console.log("Invalid credentials");
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login };