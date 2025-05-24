const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../Controller/adminusercontroller");
router.get("/all", getAllUsers);
module.exports = router;
