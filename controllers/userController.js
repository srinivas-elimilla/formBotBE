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

// get all workspaces
const getWorkspaces = async (req, res) => {
  try {
    // Find the user by ID
    const workspaces = await User.find({
      $or: [
        {
          "sharedWith.id": req.user.id,
        },
        { _id: req.user.id },
      ],
    });

    return res.status(201).json({
      message: "all workspaces",
      workspaces,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Create new folder
const createFolder = async (req, res) => {
  const { folderName } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Check if the folder name already exists
    const folderExists =
      user.workspace?.folders.length > 0 &&
      user.workspace?.folders?.some(
        (folder) =>
          folder.folderName.toLocaleUpperCase().trim() ===
          folderName.toLocaleUpperCase().trim()
      );

    if (folderExists) {
      return res.status(400).json({ message: "folder name already exists" });
    }

    const newFolder = {
      folderName: folderName,
      forms: [],
    };
    console.log("new folder", newFolder);

    user.workspace.folders.push(newFolder);

    await user.save();

    return res.status(201).json({
      message: "folder created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workspace: user.workspace,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Delete Folder
const deleteFolder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { "workspace.folders": { _id: id } } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Folder not found or already deleted", user: result });
    }

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new form
const createForm = async (req, res) => {
  const { formName, folderIndex } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Check if the folder name already exists
    const formExists =
      user.workspace?.folders.length > 0 &&
      user.workspace?.folders?.[folderIndex]?.forms?.some(
        (form) =>
          form.formName.toLocaleUpperCase().trim() ===
          formName.toLocaleUpperCase().trim()
      );

    if (formExists) {
      return res.status(400).json({ message: "form name already exists" });
    }

    const newForm = {
      formName: formName,
      elements: [],
    };

    user.workspace.folders[folderIndex].forms.push(newForm);

    await user.save();

    return res.status(201).json({
      message: "form created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workspace: user.workspace,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWorkspaces,
  createFolder,
  deleteFolder,
  createForm,
};
