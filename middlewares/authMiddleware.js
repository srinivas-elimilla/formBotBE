const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authCheck = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -__v");
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid or expired token" });
  }
};

module.exports = { authCheck };
