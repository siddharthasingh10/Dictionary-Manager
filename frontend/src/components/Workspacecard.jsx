

import { Pencil, Trash2 } from "lucide-react";

function WorkspaceCard({ workspace, onEdit, onDelete }) {
  return (
    <div className="relative border p-4 rounded-md shadow hover:shadow-lg transition cursor-pointer bg-base-100">

      {/* Title + Buttons in same row, properly aligned */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-blue-700">
          {workspace.title}
        </h3>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(workspace)}
            className="btn btn-xs btn-outline btn-primary tooltip"
            data-tip="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(workspace)}
            className="btn btn-xs btn-outline btn-error tooltip"
            data-tip="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-2">{workspace.description}</p>

      <div className="text-sm text-gray-500">
        <div><strong>Owner:</strong> {workspace.owner}</div>
        <div><strong>Collaborators:</strong> {workspace.collaborators.length}</div>
        <div><strong>Words:</strong> {workspace.words.length}</div>
      </div>
    </div>
  );
}

export default WorkspaceCard;
