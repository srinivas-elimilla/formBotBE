const User = require("../models/User");

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("error >>>>>>>", error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, oldPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Update name and email
    if (name) user.name = name;
    if (email) user.email = email;

    // Update password if provided
    if (oldPassword && newPassword) {
      console.log(oldPassword, newPassword);

      const isMatch = await user.isPasswordMatch(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "old password is incorrect" });
      }
      await user.updatePassword(oldPassword, newPassword);
      await user.save();
    }

    await user.save();
    res.status(200).json({ message: "profile updated" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };
