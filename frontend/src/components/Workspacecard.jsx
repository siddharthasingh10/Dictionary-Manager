

import { Pencil, Trash2 } from "lucide-react";
import { workspaceStore } from "../store/workspaceStore";
import { useState } from "react";
import Editworkspacemodal from "./Editworkspacemodal";
import { useNavigate } from "react-router-dom";

function WorkspaceCard({ workspace }) {
  console.log(workspace);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const clickHandler = () => {
    workspaceStore.getState().fetchWorkspaceById(workspace._id);
    navigate(`/dictionary/${workspace._id}`);
  };

  const initialData = {
    title: workspace.title,
    description: workspace.description,
    isPublic: workspace.isPublic,
  };

  const deleteHandler = async () => {
    workspaceStore.getState().deleteWorkspace(workspace._id);
  };

  return (
    <div
      onClick={clickHandler}
      className="relative border p-4 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer bg-base-100 space-y-2"
    >
      {/* Title + Public/Private Badge + Buttons */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-primary">
            {workspace.title}
          </h3>
          <span
            className={`badge px-3 py-1 text-xs font-semibold ${
              workspace.isPublic ? "badge-success" : "badge-ghost"
            }`}
          >
            {workspace.isPublic ? "Public" : "Private"}
          </span>
        </div>

        <div className="flex space-x-2">
          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // stop card click
              setShowEditModal(true);
            }}
            className="btn btn-xs btn-outline btn-primary tooltip"
            data-tip="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // stop card click
              deleteHandler();
            }}
            className="btn btn-xs btn-outline btn-error tooltip"
            data-tip="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {workspace.description && (
        <p className="text-gray-500 text-sm">{workspace.description}</p>
      )}

      {/* Metadata */}
      <div className="text-sm text-gray-400 space-y-1">
        <div>
          <strong>Owner:</strong> {workspace.author.fullName}
        </div>
        <div>
          <strong>Collaborators:</strong> {workspace.collaborators.length}
        </div>
        <div>
          <strong>Words:</strong> {workspace.words.length}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <Editworkspacemodal
          onClose={() => setShowEditModal(false)}
          initialData={initialData}
          workspaceId={workspace._id}
        />
      )}
    </div>
  );
}

export default WorkspaceCard;

