


import { useState } from "react";
import { workspaceStore } from "../store/workspaceStore";

function Workspacemodal({ onClose }) {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: false,
  });


  const handleCreate = () => {

    workspaceStore.getState().createWorkspace(formData);
    setFormData({ title: "", description: "", isPublic: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-base-100 border border-white/10 p-8 rounded-xl w-full max-w-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary">Create New Workspace</h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Workspace Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input input-bordered"
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Description (Optional)</span>
          </label>
          <textarea
            placeholder="Add some notes about your workspace"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea textarea-bordered resize-none h-24"
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
          {/* Toggle is already above, so this space balances the layout */}
          <div></div>

          <div className="flex gap-3">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500 italic">
          You can add collaborators after creating a workspace.
        </p>
      </div>
    </div>
  );
}

export default Workspacemodal;
