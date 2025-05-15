import { useState, useEffect } from "react";
import { workspaceStore } from "../store/workspaceStore";

function Editworkspacemodal({ onClose, initialData, workspaceId }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: false,
  });

  // Populate initial data when modal opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || false,
        isPublic: initialData.isPublic || false,
      });
    }
  }, [initialData]);

  const handleUpdate = () => {
    workspaceStore.getState().updateWorkspace(workspaceId, formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={onClose} // Clicking outside modal closes it
    >
      <div
        className="bg-base-100 border border-white/10 p-8 rounded-xl w-full max-w-xl shadow-lg"
        onClick={(e) => e.stopPropagation()} // This stops click from bubbling to card or backdrop
      >
        <h2 className="text-2xl font-bold mb-4 text-primary">Edit Workspace</h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Workspace Title</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input input-bordered"
            placeholder="Update title..."
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea textarea-bordered resize-none h-24"
            placeholder="Update description..."
          />
        </div>

        <div className="form-control mb-6">
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="checkbox checkbox-primary"
            />
            <span className="label-text">Make workspace public</span>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <div></div>

          <div className="flex gap-3">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500 italic">
          You can manage collaborators after editing this workspace.
        </p>
      </div>
    </div>
  );
}

export default Editworkspacemodal;
