const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description:{ type: String, default: "" },
  
    isPublic: { type: Boolean, default: false },
    
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
    words: [{ type: mongoose.Schema.Types.ObjectId, ref: "Word" }], 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  }, { timestamps: true });
  
  const Workspace = mongoose.model('Workspace', workspaceSchema);
  module.exports = Workspace;