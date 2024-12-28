const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getWorkspaces,
  createFolder,
  deleteFolder,
  createForm,
} = require("../controllers/userController");
const { authCheck } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", authCheck, getUserProfile);
router.put("/update-profile", authCheck, updateUserProfile);

// get workspaces
router.get("/all-workspaces", authCheck, getWorkspaces);

// create folder
router.post("/new-folder", authCheck, createFolder);

// delete folder
router.delete("/delete-folder/:id", authCheck, deleteFolder);

// create form
router.post("/new-form", authCheck, createForm);

module.exports = router;
