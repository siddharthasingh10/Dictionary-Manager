const mongoose = require("mongoose");


const wordSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    word: { type: String, required: true },
    definition: { type: String,required: true },
    example: { type: String,},
favorite: { type: Boolean, default: false },
   
    level: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    status: { type: String, enum: ["Remembered", "Not remembered"], default: "Not remembered" },
  }, { timestamps: true });
     

const Word = mongoose.model("Word", wordSchema);
module.exports = Word;