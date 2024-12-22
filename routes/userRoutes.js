const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/update-profile", authenticateToken, updateUserProfile);

module.exports = router;
