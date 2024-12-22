const express = require("express");
const { signup, login, verifyToken } = require("../controllers/authController");
const { authCheck } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-token", authCheck, verifyToken);

module.exports = router;
