const mongoose = require("mongoose");

const userPromptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  promptCount: { type: Number, default: 0 },
  lastPromptDate: { type: Date, default: null },
});

module.exports = mongoose.model("UserPrompt", userPromptSchema);
