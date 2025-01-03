const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    views: { type: Number },
    starts: { type: Number },
    completed: { type: Boolean },
    formId: { type: mongoose.Schema.ObjectId },
    userId: { type: mongoose.Schema.ObjectId },
    answers: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema);
