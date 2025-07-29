
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const Workspace = require("../models/workspace.model");

const createWorkspace = async (req, res) => {
    try {
        const { title, description,isPublic } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!title) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const userId = req.id;

        // Double check userId is not undefined
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid User ID" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if workspace with same title exists for the user
        const existingWorkspace = await Workspace.findOne({ title, author: userId });
        if (existingWorkspace) {
            return res.status(400).json({ message: "Workspace already exists" });
        }

        // Create workspace
        const workspace = await Workspace.create({
            title,
            description,
            author: userId,
            isPublic
        });
       

        // Push workspace to user's list
        user.workspaces.push(workspace._id);
        await user.save();

        // Populate author details
        await workspace.populate({ path: "author", select: "fullName email" });

        res.status(201).json({
            message: "Workspace created successfully",
            success: true,
            workspace
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error in creating workspace",
            error: error.message
        });
    }
};

const deleteWorkspace=async(req,res)=>{

    try {
        const {workspaceId}=req.params;
        const userId=req.id;
        console.log(workspaceId)
        if(!workspaceId){
            return res.status(400).json({message:"Please provide workspace id"});
        }
        const workspace=await Workspace.findById(workspaceId);
        if(!workspace){
            return res.status(404).json({message:"Workspace not found"});
        }
        if(workspace.author.toString()!==userId.toString()){
            return res.status(403).json({message:"You are not authorized to delete this workspace"});
        }
        await Workspace.findByIdAndDelete(workspaceId);
        res.status(200).json({message:"Workspace deleted successfully",success:true});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error in deleting workspace",
            error: error.message
        });
    }
}

const getAllWorkspace=async(req,res)=>{
    try {
        
        const workspace = await Workspace.find({ isPublic: true })
  .sort({ createdAt: -1 })
  .populate({ path: "author", select: "fullName email" })
  .populate({ path: "words",select:"word "});

        if(!workspace){
            return res.status(404).json({message:"No workspaces found"});
        }
        res.status(200).json({message:"All workspaces",success:true,workspaces:workspace});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error in getting all workspaces",
            error: error.message
        });
    }

}
const editWorkspace=async(req,res)=>{

    try {
        const {workspaceId}=req.params;
        const {title,description,isPublic}=req.body;
        const userId=req.id;
        if(!workspaceId){
            return res.status(400).json({message:"Please provide workspace id"});
        }
        const workspace=await Workspace.findById(workspaceId);
        if(!workspace){
            return res.status(404).json({message:"Workspace not found"});
        }
        if(workspace.author.toString()!==userId.toString()){
            return res.status(403).json({message:"You are not authorized to edit this workspace"});
        }
        if(title){
            workspace.title=title;
        }
        if(description){
            workspace.description=description;
        }
      if (typeof isPublic === "boolean") {
    workspace.isPublic = isPublic;
}

        await workspace.save();
        res.status(200).json({message:"Workspace updated successfully",success:true,workspace});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error in editing workspace",
            error: error.message
        });
    }
}
const getWorkspaceById=async(req,res)=>{
    try {
        const {workspaceId}=req.params;
        const userId=req.id;
        const author=await User.findById(userId);
        // console.log(author.email)

        if(!workspaceId){
            return res.status(400).json({message:"Please provide workspace id"});
        }
        const workspace=await Workspace.findById(workspaceId).populate({path:"author",select:"fullName email"}).populate({path:"collaborators",select:"fullName email"}).populate({path:"words",select:"word"});
        if(!workspace){
            return res.status(404).json({message:"Workspace not found"});
        }
       
       
       
        res.status(200).json({message:"Workspace found",success:true,workspace});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error in getting workspace by id",
            error: error.message
        });
    }
}
const getAllWorkspacesByUserId=async(req,res)=>{
    try {
        const {userId}=req.params;
        if(!userId){
            return res.status(400).json({message:"Please provide user id"});
        }
        const workspaces=await Workspace.find({author:userId}).sort({createdBy:-1}).populate({path:"author",select:"fullName email"});
        if(!workspaces){
            return res.status(404).json({message:"No workspaces found"});
        }
        res.status(200).json({message:"All workspaces",success:true,workspaces});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error in getting all workspaces by user id",
            error: error.message
        });
    }
}

const addCollaborators = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { workspaceId, friendIds = [], emails = [] } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required." });
    }

    // 1. Find workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found." });
    }

    // 2. Validate friendIds
    const validFriends = await User.find({ _id: { $in: friendIds } }).select("_id");
    if (validFriends.length !== friendIds.length) {
      return res.status(400).json({ error: "Some friend IDs are invalid or users not found." });
    }

    // 3. Validate emails
    const emailUsers = await User.find({ email: { $in: emails } }).select("_id");
    if (emailUsers.length !== emails.length) {
      return res.status(400).json({ error: "Some email addresses are not registered." });
    }

    // 4. Combine all user IDs to add
    const newCollaboratorIds = [
      ...validFriends.map((u) => u._id.toString()),
      ...emailUsers.map((u) => u._id.toString())
    ];

    // 5. Remove already existing collaborators
    const existingIds = workspace.collaborators.map((id) => id.toString());

    const uniqueCollaborators = newCollaboratorIds.filter(
      (id) => !existingIds.includes(id)
    );

    if (uniqueCollaborators.length === 0) {
      return res.status(400).json({ error: "All collaborators are already added." });
    }

    // 6. Push new collaborators to workspace
    workspace.collaborators.push(...uniqueCollaborators.map(id => new mongoose.Types.ObjectId(id)));
    await workspace.save();

    // 7. Update collaborators' user docs to include this workspace
    await User.updateMany(
      { _id: { $in: uniqueCollaborators } },
      { $addToSet: { collaborations: workspaceId } }
    );

    // 8. Return fully populated workspace
    const updatedWorkspace = await Workspace.findById(workspaceId)
      .populate("author", "fullName email")
      .populate("collaborators", "fullName email");

    console.log("Updated Workspace:", updatedWorkspace);

    res.status(200).json({
      message: "Collaborators added successfully",
      updatedWorkspace,
    });
  } catch (error) {
    console.error("Add Collaborators Error:", error);
    res.status(500).json({ error: "Something went wrong while adding collaborators." });
  }
};
const getCollaboratedWorkspaces = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const userId = req.id;
        console.log("User ID:", userId);
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Find all workspaces where the user is a collaborator
        const workspaces = await Workspace.find({ collaborators: userId })
            .populate("author", "fullName email")
            .populate("collaborators", "fullName email");
       
        res.status(200).json({
            message: "Collaborated workspaces fetched successfully",
            success: true,
            workspaces
        });
    } catch (error) {
        console.error("Error fetching collaborated workspaces:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }

}


const likeOrDislikeWorkspace = async (req, res) => {
  try {
    const userId = req.id;
    const workspaceId = req.params.workspaceId;
    const action = req.params.action; // 'like' or 'dislike'

    const workspace = await Workspace.findById(workspaceId).populate('author', 'fullName');

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (action === 'like') {
      if (!workspace.likes.includes(userId)) {
        workspace.likes.push(userId);
      }
    } else {
      workspace.likes = workspace.likes.filter(id => id.toString() !== userId);
    }

    await workspace.save();

    res.status(200).json({
      message: `Workspace ${action}d successfully`,
      workspace: {
        ...workspace.toObject(),
        likesCount: workspace.likes.length
      }
    });

  } catch (err) {
    console.error("Like/dislike error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Save/Unsave Controller
const saveWorkspace = async (req, res) => {
  try {
    const userId = req.id;
    const workspaceId = req.params.workspaceId;
    
    const user = await User.findById(userId);
    const workspace = await Workspace.findById(workspaceId).populate('author', 'fullName');

    if (!user || !workspace) {
      return res.status(404).json({ message: "User or workspace not found" });
    }

    const isSaved = user.savedWorkspaces.includes(workspaceId);
    
    if (isSaved) {
      user.savedWorkspaces.pull(workspaceId);
    } else {
      user.savedWorkspaces.push(workspaceId);
    }

    await user.save();

    res.status(200).json({
      message: isSaved ? "Removed from saved" : "Saved to collection",
      updatedUser: user,
      workspace: workspace
    });

  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getAllSavedWorkspaces = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).select("savedWorkspaces");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedWorkspaces = await Workspace.find({
      _id: { $in: user.savedWorkspaces },
    })
      .populate("author", "fullName email")
      .populate("collaborators", "fullName email");

    res.status(200).json({
      message: "Saved workspaces fetched successfully",
      success: true,
      savedWorkspaces,
    });
  } catch (error) {
    console.error("Error fetching saved workspaces:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
module.exports={   
    createWorkspace,
    deleteWorkspace,
    getAllWorkspace,
    editWorkspace,getWorkspaceById,
    getAllWorkspacesByUserId,
    addCollaborators,
    getCollaboratedWorkspaces,
    getAllSavedWorkspaces,
    saveWorkspace,
 likeOrDislikeWorkspace 
   
}