
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Workspace = require("../models/workspace.model");

const createWorkspace = async (req, res) => {
    try {
        const { title, description } = req.body;

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
            author: userId
        });
        console.log(workspace,user);

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
        const workspace=await Workspace.find().sort({createdAt:-1}).populate({path:"author",select:"fullName email"});
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
        if(isPublic){
            workspace.isPublic=isPublic;
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
        if(!workspaceId){
            return res.status(400).json({message:"Please provide workspace id"});
        }
        const workspace=await Workspace.findById(workspaceId).populate({path:"author",select:"fullName email"});
        if(!workspace){
            return res.status(404).json({message:"Workspace not found"});
        }
        if(workspace.author.toString()!==userId.toString()){
            return res.status(403).json({message:"You are not authorized to view this workspace"});
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

module.exports={
    createWorkspace,
    deleteWorkspace,
    getAllWorkspace,
    editWorkspace,getWorkspaceById,
    getAllWorkspacesByUserId
}