const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
          validator: function (v) {
            return !this._id.equals(v); // Prevent self-friending
          },
          message: "Cannot add yourself as a friend",
        },
      },
    ],
    savedWorkspaces: [ { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },],
    collaborations: [ { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
