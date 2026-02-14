const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const login = async (req, res) => {
  const { idOrRollNo, role } = req.body;
  console.log(idOrRollNo);

  try {
    const user = await User.findOne({ identifier: idOrRollNo, role });

    if (user) {
      const token = jwt.sign({ idOrRollNo: idOrRollNo, role: "user" }, "sac", {
        expiresIn: "1h",
      });
      return res.json({
        success: true,
        token,
        role: "user",
        name: user.name,
        id: user.identifier,
      });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Database query error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { login };
