// components/AiWordSuggestion.jsx
import { useStore } from "zustand";
import { workspaceStore } from "../store/workspaceStore";
import { wordStore } from "../store/wordStore";
import { toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

function AiWordSuggestion({ workspaceId }) {
  const { aiWords, clearAiSuggestions } = useStore(workspaceStore);
  const { words, addWordFromAi } = useStore(wordStore);

  const isWordExists = (word) => {
    return words.some((w) => w.word.toLowerCase() === word.toLowerCase());
  };

  const handleAddWord = async (wordObj) => {
    const exists = isWordExists(wordObj.word);
    if (exists) return;
    try {
      await addWordFromAi(wordObj, workspaceId);
     
    } catch (err) {
      toast.error("Failed to add word");
      console.error("Add word error:", err);
    }
  };

  if (!aiWords.length) return null;

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg mt-4">
      <div className="flex justify-end gap-2 p-2">
        <button onClick={clearAiSuggestions} className="btn btn-outline btn-sm">
          Discard
        </button>
      </div>

      <div className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_80px] bg-neutral text-neutral-content p-2 font-semibold text-left text-sm">
        <div>#</div>
        <div>Word</div>
        <div>Definition</div>
        <div className="text-center">Level</div>
        <div className="text-center">Status</div>
        <div>Example</div>
        <div>Actions</div>
      </div>

      {aiWords.map((wordObj, index) => {
        const exists = isWordExists(wordObj.word);
        const levelColor =
          wordObj.level === "Easy"
            ? "text-green-500"
            : wordObj.level === "Medium"
            ? "text-yellow-400"
            : "text-red-500";

        return (
          <div
            key={index}
            className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_80px] items-center border-b border-base-300 p-2"
          >
            <div>{index + 1}</div>
            <div className="font-medium">{wordObj.word}</div>
            <div className="whitespace-pre-line">{wordObj.definition}</div>
            <div className={`text-center font-bold ${levelColor}`}>
              {wordObj.level}
            </div>
            <div className="text-center text-gray-400">Not remembered</div>
            <div className="whitespace-pre-line">{wordObj.example}</div>
            <div className="flex justify-end">
              <button
                disabled={exists}
                onClick={() => handleAddWord(wordObj)}
                className={`btn btn-xs ${exists ? "btn-outline" : "btn-primary"}`}
              >
                {exists ? "✓ Added" : <><FaPlus className="mr-1" /> Add</>}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AiWordSuggestion;
