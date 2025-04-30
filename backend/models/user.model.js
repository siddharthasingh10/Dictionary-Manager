  const mongoose= require('mongoose');

  const userSchema = new mongoose.Schema({
      fullName: { type: String, required: true },
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true, select: false },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
      friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      savedWorkspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
      collaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
    }, { timestamps: true });
    

  const User=mongoose.model('User',userSchema);
  module.exports=User;