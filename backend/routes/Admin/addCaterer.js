const express = require("express");
const { addCaterer } = require("../../controllers/Admin/caterer");
const router = express.Router();
router.post("/", addCaterer);
module.exports = router;
