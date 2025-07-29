

// components/WorkspaceAiSection.jsx
import { useStore } from "zustand";
import { workspaceStore } from "../store/workspaceStore";
import { wordStore } from "../store/wordStore";
import { toast } from "react-hot-toast";
import AiWordSuggestions from "./AiWordSuggestions";

function WorkspaceAiSection({ workspaceId }) {

  const {
    aiPrompt,
    aiWords,
    isLoadingAi,
    askAiFromPrompt,
    clearAiSuggestions,
    setAiPrompt,
  } = useStore(workspaceStore);

  const { words, addWordFromAi } = useStore(wordStore);
  

  const handleAskAi = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    try {
      await askAiFromPrompt(aiPrompt);
    } catch (error) {
      toast.error("Failed to generate words");
      console.error("AI generation error:", error);
    }
  };

  const handleAddAll = async () => {
    if (aiWords.length === 0) {
      toast.error("No words to add");
      return;
    }

    let added = 0;
    for (const word of aiWords) {
      const exists = words.some(
        (w) => w.word.toLowerCase() === word.word.toLowerCase()
      );
      if (!exists) {
        try {
          await addWordFromAi(word, workspaceId);
          added++;
        } catch (error) {
          console.error("Failed to add word:", word.word, error);
        }
      }
    }

    if (added > 0) {
      toast.success(`Added ${added} new words`);
    } else {
      toast.error("No new words added - they may already exist");
    }
  };

  const isWordExists = (word) => {
    return words.some((w) => w.word.toLowerCase() === word.toLowerCase());
  };

  return (
   
   
    <div className="space-y-4 my-6">
      {/* Prompt input + Ask AI */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Ask AI for words"
          className="input input-bordered w-full max-w-md"
          disabled={isLoadingAi}
        />
        <button
          onClick={handleAskAi}
          disabled={!aiPrompt.trim() || isLoadingAi}
          className={`btn btn-primary ${isLoadingAi ? "loading" : ""}`}
        >
          Ask AI
        </button>
      </div>

      AI Suggestions
      {aiWords.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-end gap-2">
            <button className="btn btn-outline btn-sm" onClick={clearAiSuggestions}>
              Discard
            </button>
            <button className="btn btn-sm btn-success" onClick={handleAddAll}>
              Add All
            </button>
          </div>

          <AiWordSuggestions
            aiWords={aiWords}
            words={words}
            workspaceId={workspaceId}
            addWordFromAi={addWordFromAi}
            isWordExists={isWordExists}
          />
        </div>
      )}

    
    </div>

  );
}

export default WorkspaceAiSection;

