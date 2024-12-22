const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email existed" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate token and send response
    const token = generateToken(newUser._id);
    res.status(201).json({
      message: "signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        workspaces: newUser.workspaces,
      },
    });
  } catch (error) {
    console.log("error >>>>>>>>>>>>>", error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Check if the password matches
    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // Generate token and send response
    const token = generateToken(user._id);
    res.status(200).json({
      message: "login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        workspaces: user.workspaces,
        id: user._id,
      },
    });
  } catch (error) {
    console.log("error >>>>>>>>>>>>>", error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Verify Token Controller
const verifyToken = (req, res) => {
  const user = User.findById({ _id: req.user.id });
  res.status(200).json({ message: "token is valid", user });
};

module.exports = { signup, login, verifyToken };
