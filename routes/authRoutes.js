const express = require("express");
const { signup, login, verifyToken } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-token", authenticateToken, verifyToken);

module.exports = router;
