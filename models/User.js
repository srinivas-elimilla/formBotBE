const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    workspace: {
      folders: [
        {
          folderName: {
            type: String,
            required: true,
            unique: true,
          },
          forms: [
            {
              formName: {
                type: String,
                required: true,
                unique: true,
              },
              elements: [
                {
                  type: {
                    type: String,
                    enum: ["bubble", "input"],
                    default: "bubble",
                    required: true,
                  },
                  value: {
                    type: String,
                  },
                  placeholder: {
                    type: String,
                  },
                  inputType: {
                    type: String,
                  },
                },
              ],
              views: Number,
              starts: Number,
              completed: Number,
            },
          ],
        },
      ],
    },
    invitees: [
      {
        id: {
          type: mongoose.Schema.ObjectId,
        },
        mode: { type: String, enum: ["edit", "view"], default: "view" },
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

  this.password = newPassword;
};

module.exports = mongoose.model("User", userSchema);
