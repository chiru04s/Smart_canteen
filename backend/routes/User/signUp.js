const express = require("express");
const { signUp } = require("../../controllers/User/signUp");
const router = express.Router();
router.post("/", signUp);
module.exports = router;
