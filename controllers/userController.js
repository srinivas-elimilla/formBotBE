const User = require("../models/User");

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, oldPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name and email
    if (name) user.name = name;
    if (email) user.email = email;

    // Update password if provided
    if (oldPassword && newPassword) {
      const isMatch = await user.isPasswordMatch(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }
      await user.updatePassword(oldPassword, newPassword);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };
