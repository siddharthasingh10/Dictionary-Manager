import { Heart, Bookmark, Users } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { workspaceStore } from "../store/workspaceStore";
import { userAuthStore } from "../store/userAuthStore";
import { useState } from "react";
function WorkspacePost({ workspace }) {
  const { authUser } = userAuthStore();
  const { likeOrdislikeWorkspace, fetchWorkspaceById, saveWorkspace, savedWorkspaces=[] } = workspaceStore();
  const navigate = useNavigate();

  // Derived states
  const liked = workspace?.likes?.includes(authUser?._id) || false;
  console.log(savedWorkspaces.includes(workspace?._id));
  console.log(savedWorkspaces);
  // const [saved,setSaved] =useState( savedWorkspaces?.includes(workspace?._id) || false);
  const [saved, setSaved] = useState(
  savedWorkspaces?.some(w => w._id === workspace?._id) || false
);

 
  const likesCount = workspace?.likes?.length || 0;

  // Handle like/dislike
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!authUser) {
      navigate('/login');
      return toast.error('Please login to like workspaces');
    }
    
    try {
      await likeOrdislikeWorkspace(workspace._id, liked ? 'dislike' : 'like');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to like workspace");
      console.error("Like error:", error);
    }
  };

  // Handle save/unsave
  const handleSave = async (e) => {
    e.stopPropagation();
    // if (!authUser) {
    //   navigate('/login');
    //   return toast.error('Please login to save workspaces');
    // }
    
    try {
      await saveWorkspace(workspace._id);
      setSaved(!saved);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save workspace");
      console.error("Save error:", error);
    }
  };

  // Handle card click to view workspace
  const handleCardClick = () => {
    fetchWorkspaceById(workspace._id);
    navigate(`/dictionary/${workspace._id}`);
  };

  // Safely access author info
  const authorName = workspace?.author?.fullName || "Unknown";
  const authorInitial = authorName.charAt(0).toUpperCase();

  // Get first 5 words
  const wordPreview = workspace?.words?.slice(0, 5).map(word => 
    typeof word === "string" ? word : word.word
  ) || [];

  return (
    <div className="card bg-base-100 shadow-md rounded-xl border hover:shadow-xl transition cursor-pointer">
      {/* Header with author info */}
      <div className="flex items-center p-4 gap-3 border-b">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-8">
            <span>{authorInitial}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold">{authorName}</p>
          <p className="text-xs text-gray-500">
            {new Date(workspace?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Workspace content - clickable area */}
      <div onClick={handleCardClick} className="p-4 space-y-2">
        <h2 className="text-lg font-bold">{workspace?.title || "Untitled"}</h2>
        <p className="text-sm">{workspace?.description || "No description"}</p>
        
        {/* Word preview */}
        {wordPreview.length > 0 ? (
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            {wordPreview.map((word, idx) => (
              <li key={idx}>{word}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">No words to preview</p>
        )}
      </div>

      {/* Footer with actions */}
      <div className="border-t px-4 py-3 flex justify-between">
        <button 
          onClick={handleLike} 
          className="flex items-center gap-1 hover:text-red-500 transition-colors"
        >
          <Heart className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : ""}`} />
          <span>{likesCount} {liked ? "Liked" : "Like"}</span>
        </button>
        
        <button 
          onClick={handleSave} 
          className="flex items-center gap-1 hover:text-yellow-500 transition-colors"
        >
          <Bookmark className={`w-5 h-5 ${saved ? "text-yellow-500 fill-yellow-500" : ""}`} />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}

export default WorkspacePost;


