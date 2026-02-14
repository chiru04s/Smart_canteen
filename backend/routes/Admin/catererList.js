const express = require("express");
const { CatererList } = require("../../controllers/Admin/caterer");
const router = express.Router();
router.get("/", CatererList);

module.exports = router;
 