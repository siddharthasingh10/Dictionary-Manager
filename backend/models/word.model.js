const wordSchema = new mongoose.Schema({

    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    word: { type: String, required: true },
    definition: { type: String, required: true },
    example: { type: String, required: true },
    synonyms: [{ type: String }],
    isComplete: { type: Boolean, default: false },
  }, { timestamps: true });
  