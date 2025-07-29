import { useNavigate } from "react-router-dom";
import { workspaceStore } from "../store/workspaceStore";

function SavedWorkspaceCard({ workspace }) {
  const navigate = useNavigate();

  const clickHandler = () => {
    workspaceStore.getState().fetchWorkspaceById(workspace._id);
    navigate(`/dictionary/${workspace._id}`);
  };

  return (
    <div
      onClick={clickHandler}
      className="relative border p-4 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer bg-base-100 space-y-2"
    >
      {/* Title + Badge */}
      <div className="flex justify-between items-center">
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
    </div>
  );
}

export default SavedWorkspaceCard;
