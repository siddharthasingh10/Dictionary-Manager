import { useState } from "react";
import { wordStore } from "../store/wordStore";
import { workspaceStore } from "../store/workspaceStore";




function WordCreateModal({ onClose }) {
  const [error, setError] = useState("");
  const { selectedWorkspace } = workspaceStore();
  const [formData, setFormData] = useState({
    word: "",
    definition: "",
    example: "",
    level: "Easy",
    status: "Not remembered",
    favorite: false,
    workspaceId:selectedWorkspace,
  });




const handleSubmit = () => {
  if (!formData.word.trim() || !formData.definition.trim()) {
    setError("Word and definition are required.");
    return; 
  }

  wordStore.getState().createWord(formData);

  setFormData({
    word: "",
    definition: "",
    example: "",
    level: "Easy",
    status: "Not remembered",
    favorite: false,
  });

  setError(""); // clear any previous error
  onClose();
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-base-100 border border-white/10 p-8 rounded-xl w-full max-w-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary">Add New Word</h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Word</span>
          </label>
          <input
            type="text"
            placeholder="Enter word"
            value={formData.word}
            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
            className="input input-bordered"
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Definition</span>
          </label>
          <textarea
            placeholder="Add a definition"
            value={formData.definition}
            onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
            className="textarea textarea-bordered h-20"
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Example</span>
          </label>
          <textarea
            placeholder="Use the word in a sentence"
            value={formData.example}
            onChange={(e) => setFormData({ ...formData, example: e.target.value })}
            className="textarea textarea-bordered h-20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Difficulty Level</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option>Remembered</option>
              <option>Not remembered</option>
            </select>
          </div>
        </div>

        <div className="form-control mb-6">
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={formData.favorite}
              onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
            />
            <span className="label-text">Mark as Favorite</span>
          </label>
        </div>
        {error && (
  <p className="text-red-500 text-sm mb-3">
    {error}
  </p>
)}

        <div className="flex justify-end gap-3">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Word</button>
        </div>
      </div>
    </div>
  );
}

export default WordCreateModal;
