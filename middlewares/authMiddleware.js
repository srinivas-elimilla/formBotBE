const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authCheck = async (req, res, next) => {
  const token =
    req.headers["authorization"] &&
    req.headers["authorization"].replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid or expired token" });
  }
};

module.exports = { authCheck };
