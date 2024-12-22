const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { authCheck } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", authCheck, getUserProfile);
router.put("/update-profile", authCheck, updateUserProfile);

module.exports = router;
