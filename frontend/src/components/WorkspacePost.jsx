import { Heart, Bookmark, Users } from "lucide-react";
import { useEffect } from "react";
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

// import { Heart, Bookmark, Users } from "lucide-react";
// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import { workspaceStore } from "../store/workspaceStore";
// import { userAuthStore } from "../store/userAuthStore";
// import { useNavigate } from "react-router-dom";

// function WorkspacePost({ workspace }) {
//   const { authUser } = userAuthStore();
//   const { likeOrdislikeWorkspace, fetchWorkspaceById, saveWorkspace } = workspaceStore();
//   const navigate = useNavigate();

//   // Like state
//   const [liked, setLiked] = useState(
//     Array.isArray(workspace?.likes) && authUser?._id
//       ? workspace.likes.includes(authUser._id)
//       : false
//   );
//   const [likesCount, setLikesCount] = useState(workspace?.likes?.length || 0);

//   // Save state
//   const [saved, setSaved] = useState(
//     Array.isArray(authUser?.savedWorkspaces) && workspace?._id
//       ? authUser.savedWorkspaces.includes(workspace._id)
//       : false
//   );

//   // Sync save state when authUser changes
//   useEffect(() => {
//     if (authUser && workspace) {
//       setSaved(
//         Array.isArray(authUser.savedWorkspaces)
//           ? authUser.savedWorkspaces.includes(workspace._id)
//           : false
//       );
//     }
//   }, [authUser, workspace]);

//   const handleLike = async (e) => {
//     e.stopPropagation();
    
//     if (!authUser) {
//       toast.error('Please login to like workspaces');
//       navigate('/login');
//       return;
//     }
    
//     try {
//       const action = liked ? "dislike" : "like";
//       await likeOrdislikeWorkspace(workspace._id, action);
//       setLiked(!liked);
//       setLikesCount(prev => (liked ? prev - 1 : prev + 1));
//     } catch (error) {
//       console.error("Error liking/disliking workspace:", error);
//       toast.error(error?.response?.data?.message || "Failed to like workspace");
//     }
//   };

//   const handleSave = async (e) => {
//     e.stopPropagation();
    
//     // if (!authUser) {
//     //   toast.error('Please login to save workspaces');
//     //   navigate('/login');
//     //   return;
//     // }

//     try {
//       const isNowSaved = await saveWorkspace(workspace._id);
//       toast.success(isNowSaved ? "Saved to your collection" : "Removed from saved");
//     } catch (error) {
//       console.error("Error saving workspace:", error);
//       toast.error(error?.response?.data?.message || "Failed to save workspace");
//     }
//   };

//   const handleCardClick = () => {
//     fetchWorkspaceById(workspace._id);
//     navigate(`/dictionary/${workspace._id}`);
//   };

//   // Get first 5 words
//   const wordPreview =
//     workspace.words
//       ?.slice(0, 5)
//       .map((word) => (typeof word === "string" ? word : word.word)) || [];

//   return (
//     <div className="card bg-base-100 shadow-md rounded-xl border hover:shadow-xl transition cursor-pointer">
//       <div className="flex flex-col md:flex-row">
//         {/* Left - Post Details */}
//         <div className="md:w-1/2 w-full p-4 space-y-2 border-r">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="avatar placeholder">
//                 <div className="bg-neutral text-neutral-content rounded-full w-8">
//                   <span>{workspace.author?.fullName?.charAt(0) || "U"}</span>
//                 </div>
//               </div>
//               <div>
//                 <p className="font-semibold text-sm">
//                   {workspace.author?.fullName || "Unknown"}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(workspace.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             <span className={`badge text-xs ${workspace.isPublic ? "badge-success" : "badge-neutral"}`}>
//               {workspace.isPublic ? "Public" : "Private"}
//             </span>
//           </div>

//           <h2 onClick={handleCardClick} className="text-lg font-bold text-primary">
//             {workspace.title || "Untitled"}
//           </h2>
//           <p className="text-sm text-gray-600">
//             {workspace.description || "No description available"}
//           </p>

//           <div className="flex items-center gap-2 text-sm text-gray-400">
//             <Users className="w-4 h-4" />
//             <span>{workspace.collaborators?.length || 0} collaborators</span>
//           </div>

//           <p className="text-sm text-gray-400">
//             {workspace.words?.length || 0} words
//           </p>
//         </div>

//         {/* Right - Word Preview Box */}
//         <div className="md:w-1/2 w-full p-4 flex items-center justify-center">
//           <div className="bg-base-200 rounded-lg p-4 w-full h-full flex flex-col justify-center">
//             {wordPreview.length > 0 ? (
//               <ul className="list-disc list-inside text-sm text-base-content space-y-1">
//                 {wordPreview.map((word, idx) => (
//                   <li key={idx}>{word}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-400 italic text-center">
//                 No words to preview
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="border-t px-4 py-3 flex items-center justify-between text-sm">
//         <button
//           onClick={handleLike}
//           className="flex items-center gap-1 hover:text-red-500 transition-colors"
//         >
//           <Heart className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : ""}`} />
//           <span>{liked ? "Liked" : "Like"} {likesCount}</span>
//         </button>
//         <button 
//           onClick={handleSave}
//           className="flex items-center gap-1 hover:text-yellow-500 transition-colors"
//         >
//           <Bookmark className={`w-5 h-5 ${saved ? "text-yellow-500 fill-yellow-500" : ""}`} />
//           <span>{saved ? "Saved" : "Save"}</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default WorkspacePost;


// import { Heart, Bookmark, Users } from "lucide-react";
// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { workspaceStore } from "../store/workspaceStore";
// import { userAuthStore } from "../store/userAuthStore";
// import { useNavigate } from "react-router-dom";


// function WorkspacePost({ workspace }) { 
//   console.log("WorkspacePost component rendered with workspace:", workspace);
//   const { authUser } = userAuthStore();
//   // console.log("AuthUser in WorkspacePost:", authUser);
//   const { likeOrdislikeWorkspace,fetchWorkspaceById,saveWorkspace } = workspaceStore();
//   const navigate = useNavigate();

// const [liked, setLiked] = useState(
//   Array.isArray(workspace?.likes) && authUser?._id
//     ? workspace.likes.includes(authUser._id)
//     : false
// );

// const [saved, setSaved] = useState(
//   Array.isArray(authUser?.savedWorkspaces) && workspace?._id
//     ? authUser.savedWorkspaces.includes(workspace._id)
//     : false
// );

//   // const [liked, setLiked] = useState(
//   //   workspace.likes.includes(authUser._id) || false
//   // );
  
//   // const [saved, setSaved] = useState(  authUser.savedWorkspaces.includes(workspace._id) ||false);
  
//   const [likesCount, setLikesCount] = useState(workspace?.likes?.length || 0);

//   const handleLike = async (e) => {
//     e.stopPropagation();
//     try {
//       const action =liked ? "dislike" : "like";
//       likeOrdislikeWorkspace(workspace._id, action);
//       setLiked(!liked);
//       setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      
//     } catch (error) {
//       console.error("Error liking/disliking workspace:", error);
//     }

//     // if (!authUser) {
//     //   toast.error('Please login to like workspaces');
//     //   navigate('/login');
//     //   return;
//     // }
//     // await likeWorkspace(workspace._id);
//   };

//   const handleSave = async (e) => {
//    console.log("Saving workspace with ID post comp:", workspace._id);
//    saveWorkspace(workspace._id);

//   };

//   const handleCardClick = () => {
    
//    fetchWorkspaceById(workspace._id);

//     navigate(`/dictionary/${workspace._id}`);
//   };

//   // Get first 5 words (if words are populated)
//   const wordPreview =
//     workspace.words
//       ?.slice(0, 5)
//       .map((word) => (typeof word === "string" ? word : word.word)) || [];

//   return (
//     <div  className="card bg-base-100 shadow-md rounded-xl border hover:shadow-xl transition ">
//       {/* Main Two Column Layout */}
//       <div className="flex flex-col md:flex-row">
//         {/* Left - Post Details */}
//         <div className="md:w-1/2 w-full p-4 space-y-2 border-r">
//           {/* Author Info */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="avatar placeholder">
//                 <div className="bg-neutral text-neutral-content rounded-full w-8">
//                   <span>{workspace.author?.fullName?.charAt(0) || "U"}</span>
//                 </div>
//               </div>
//               <div>
//                 <p className="font-semibold text-sm">
//                   {workspace.author?.fullName || "Unknown"}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(workspace.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             <span
//               className={`badge text-xs ${
//                 workspace.isPublic ? "badge-success" : "badge-neutral"
//               }`}
//             >
//               {workspace.isPublic ? "Public" : "Private"}
//             </span>
//           </div>

//           {/* Title & Description */}
//           <h2 onClick={handleCardClick} className="text-lg font-bold text-primary cursor-pointer">
//             {workspace.title || "Untitled"}
//           </h2>
//           <p className="text-sm text-gray-600">
//             {workspace.description || "No description available"}
//           </p>

//           {/* Collaborators & Word Count */}
//           <div className="flex items-center gap-2 text-sm text-gray-400">
//             <Users className="w-4 h-4" />
//             <span>{workspace.collaborators?.length || 0} collaborators</span>
//           </div>

//           <p className="text-sm text-gray-400">
//             {workspace.words?.length || 0} words
//           </p>
//         </div>

//         {/* Right - Word Preview Box */}
//         <div className="md:w-1/2 w-full p-4 flex items-center justify-center">
//           <div className="bg-base-200 rounded-lg p-4 w-full h-full flex flex-col justify-center">
//             {wordPreview.length > 0 ? (
//               <ul className="list-disc list-inside text-sm text-base-content space-y-1">
//                 {wordPreview.map((word, idx) => (
//                   <li key={idx}>{word}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-400 italic text-center">
//                 No words to preview
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer - Full width */}
//       <div className="border-t px-4 py-3 flex items-center justify-between text-sm">
//         <button
//           onClick={handleLike}
//           className="flex items-center gap-1 hover:text-red-500"
//         >
//           <Heart
//             className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : ""}`}
//           />
//           <span>
//             {liked ? "Liked" : "Like"} {likesCount}
//           </span>
//         </button>
//         <button onClick={handleSave} className="flex items-center gap-1 hover:text-yellow-500">
//           <Bookmark
//             className={`w-5 h-5 ${
//               saved ? "text-yellow-500 fill-yellow-500" : ""
//             }`}
//           />
//           <span>{liked ? "Saved" : "Save"}</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default WorkspacePost;

