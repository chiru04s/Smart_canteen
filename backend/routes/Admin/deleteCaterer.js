const express = require("express");
const { deleteCaterer } = require("../../controllers/Admin/caterer");
const router = express.Router();
router.delete("/:catererId", deleteCaterer);
module.exports = router;
