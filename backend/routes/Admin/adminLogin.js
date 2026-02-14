const express = require("express");
const { login } = require("../../controllers/Admin/login");
const router = express.Router();
router.post("/", login);
module.exports = router;
