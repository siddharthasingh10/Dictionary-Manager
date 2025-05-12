const mongoose = require('mongoose');
const Word = require('../models/word.model');

const Workspace = require('../models/workspace.model');
const User = require('../models/user.model');

const { validationResult } = require('express-validator');

const createWord = async (req, res) => {

    try {
        const {word,definition,example,level,status,workspaceId,favorite}=req.body;
    

        const workspace = await Workspace.findById(workspaceId);

        console.log("Workspace",Workspace);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
      const newWord=  await Word.create({
            author: req.id,
            word,
            definition,
            example,
            level,
            status,
            favorite,
            workspace: workspaceId
        });
        workspace.words.push(newWord._id);
        await workspace.save();

        res.status(201).json({
            message: "Word created successfully",
            success: true,
            word: newWord
        });
        
    } catch (error) {
        console.error("Error creating word:", error);
        res.status(500).json({ message: "Internal server error saving  a word " });
    }

}

const wordsByWorkspceId=async(req,res)=>{
    try {
        const { workspaceId } = req.params;
      
        const words = await Word.find({ workspace: workspaceId }).sort({ createdAt: -1 }).populate("author", "fullName email").populate("workspace", "title description isPublic");
       
     
        res.status(200).json({
            message: "Words fetched successfully",
            success: true,
            words
        });
    } catch (error) {
        console.error("Error fetching words by workspace ID or Words:", error);
        res.status(500).json({ message: "Internal server error fetching words" });
    }
}
const deleteWord=async(req,res)=>{
    try {
        const { wordId } = req.params;
        const word = await Word.findById(wordId);
        if (!word) {     
            return res.status(404).json({ message: "Word not found" });
        }
        const workspace = await Workspace.findById(word.workspace);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        console.log(workspace);        
        // workspace.words = workspace.words.filter((w) => console.log("Word",w) && w.toString() !== wordId.toString());
        // await workspace.save();
        // await Word.findByIdAndDelete(wordId);
        res.status(200).json({
            message: "Word deleted successfully",
            success: true,
        });

    } catch (error) {
        console.error("Error deleting word:", error);
        res.status(500).json({ message: "Internal server error deleting word" });
    }
}

 const toggleFavorite = async (req, res) => {
    try {
        const { wordId } = req.params;
        const { favorite } = req.body;
        console.log("Toggling favorite for word:", wordId, favorite);
        const word = await Word.findByIdAndUpdate(wordId,{favorite:(!favorite)},{new:true});
        if (!word) {
            return res.status(404).json({ message: "Word not found" });
        }
      
       console.log("Word after toggling favorite:", word);
        res.status(200).json({
            message: "Word favorite status updated successfully",
            success: true,
            word
        });
      } catch (error) {
        res.status(400).json({ message: "Error toggling favorite" });
      }
  };
  const updateWord=async(req,res)=>{
    try {
        const { wordId } = req.params;
        console.log(req.body);
        const { word, definition, example, level, status, favorite } = req.body;
        const wordToUpdate = await Word.findById(wordId);
        if (!wordToUpdate) {
            return res.status(404).json({ message: "Word not found" });
        }
        wordToUpdate.word = word || wordToUpdate.word;
        wordToUpdate.definition = definition || wordToUpdate.definition;
        wordToUpdate.example = example || wordToUpdate.example;
        wordToUpdate.level = level || wordToUpdate.level;
        wordToUpdate.status = status || wordToUpdate.status;
        wordToUpdate.favorite = favorite || wordToUpdate.favorite;
        await wordToUpdate.save();
        res.status(200).json({
            message: "Word updated successfully",
            success: true,
            word: wordToUpdate
        });

    } catch (error) {
        console.error("Error updating word:", error);
        res.status(500).json({ message: "Internal server error updating word" });
    }
  }
module.exports = {
    createWord,wordsByWorkspceId,deleteWord,toggleFavorite,updateWord
};