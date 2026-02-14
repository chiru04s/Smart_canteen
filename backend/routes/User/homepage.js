const express = require("express");
const { homePage } = require("../../controllers/User/homePage");
const router = express.Router();
router.get("/", homePage);
module.exports = router;
