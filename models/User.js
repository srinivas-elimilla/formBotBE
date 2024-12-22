const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    workspaces: [
      {
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
        mode: { type: String, enum: ["edit", "view"], required: true },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Method to update password
userSchema.methods.updatePassword = async function (oldPassword, newPassword) {
  const isMatch = await this.isPasswordMatch(oldPassword);
  if (!isMatch) throw new Error("old password is incorrect");

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
};

module.exports = mongoose.model("User", userSchema);
