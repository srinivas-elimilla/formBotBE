const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getWorkspaces,
  createFolder,
  deleteFolder,
  createForm,
  deleteForm,
  createFormBot,
  fetchFormById,
  shareWorkspace,
} = require("../controllers/userController");
const { authCheck } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", authCheck, getUserProfile);
router.put("/update-profile", authCheck, updateUserProfile);

// get workspaces
router.get("/:id/all-workspaces", authCheck, getWorkspaces);

// share workspace
router.post("/share", authCheck, shareWorkspace);

// create folder
router.post("/new-folder", authCheck, createFolder);

// delete folder
router.delete("/:userId/:id/delete-folder/", authCheck, deleteFolder);

// create form
router.post("/new-form", authCheck, createForm);

// delete form
router.delete(
  "/:userId/:folderIndex/:formId/delete-form/",
  authCheck,
  deleteForm
);

// create form-bot
router.post("/form-bot", authCheck, createFormBot);

// get form-bot by formId
router.get("/form-bot/:userId/:folderIndex/:formId", fetchFormById);

module.exports = router;
