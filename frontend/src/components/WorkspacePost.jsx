// import { Heart, Bookmark, Users } from "lucide-react";
// import { useState } from "react";

// function WorkspacePost({ workspace }) {
//   const [liked, setLiked] = useState(false);
//   const [saved, setSaved] = useState(false);

//   const handleLike = () => {
//     setLiked(!liked);
//     // Call API or Zustand store here
//   };

//   const handleSave = () => {
//     setSaved(!saved);
//     // Call API or Zustand store here
//   };

//   return (
//     <div className="card bg-base-100 shadow-md rounded-xl border hover:shadow-xl transition">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4">
//         <div className="flex items-center gap-3">
//           <div className="avatar placeholder">
//             <div className="bg-neutral text-neutral-content rounded-full w-8">
//               <span>{workspace.author.fullName?.charAt(0)}</span>
//             </div>
//           </div>
//           <div>
//             <p className="font-semibold text-sm">{workspace.author.fullName}</p>
//             <p className="text-xs text-gray-500">
//               {new Date(workspace.createdAt).toLocaleDateString()}
//             </p>
//           </div>
//         </div>

//         <div>
//           <span
//             className={`badge text-xs ${
//               workspace.isPublic ? "badge-success" : "badge-neutral"
//             }`}
//           >
//             {workspace.isPublic ? "Public" : "Private"}
//           </span>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="px-4 pb-4">
//         <h2 className="text-lg font-bold text-primary mb-1">{workspace.title}</h2>
//         <p className="text-sm text-gray-600 mb-3">{workspace.description}</p>

//         <div className="flex justify-between items-center text-sm text-gray-400">
//           <div className="flex items-center gap-2">
//             <Users className="w-4 h-4" />
//             <span>{workspace.collaborators.length} collaborators</span>
//           </div>
//           <span>{workspace.words.length} words</span>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="border-t px-4 py-3 flex items-center justify-between text-sm">
//         <button onClick={handleLike} className="flex items-center gap-1">
//           <Heart className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : ""}`} />
//           <span>{liked ? "Liked" : "Like"}</span>
//         </button>
//         <button onClick={handleSave} className="flex items-center gap-1">
//           <Bookmark className={`w-5 h-5 ${saved ? "text-yellow-500 fill-yellow-500" : ""}`} />
//           <span>{saved ? "Saved" : "Save"}</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default WorkspacePost;



import { Heart, Bookmark, Users } from "lucide-react";
import { useState } from "react";

function WorkspacePost({ workspace }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = () => setLiked(!liked);
  const handleSave = () => setSaved(!saved);

  const wordPreview = workspace.words.slice(0, 5);

  return (
    <div className="card bg-base-100 shadow-md rounded-xl border hover:shadow-xl transition">
      {/* Main Two Column Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Left - Post Details */}
        <div className="md:w-1/2 w-full p-4 space-y-2 border-r">
          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span>{workspace.author.fullName?.charAt(0)}</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm">{workspace.author.fullName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <span
              className={`badge text-xs ${
                workspace.isPublic ? "badge-success" : "badge-neutral"
              }`}
            >
              {workspace.isPublic ? "Public" : "Private"}
            </span>
          </div>

          {/* Title & Description */}
          <h2 className="text-lg font-bold text-primary">{workspace.title}</h2>
          <p className="text-sm text-gray-600">{workspace.description}</p>

          {/* Collaborators & Word Count */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{workspace.collaborators.length} collaborators</span>
          </div>

          <p className="text-sm text-gray-400">{workspace.words.length} words</p>
        </div>

        {/* Right - Word Preview Box */}
        <div className="md:w-1/2 w-full p-4 flex items-center justify-center">
          <div className="bg-base-200 rounded-lg p-4 w-full h-full flex flex-col justify-center">
            {wordPreview.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-base-content space-y-1">
                {wordPreview.map((word, idx) => (
                  <li key={idx}>{word}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic text-center">No words to preview</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Full width */}
      <div className="border-t px-4 py-3 flex items-center justify-between text-sm">
        <button onClick={handleLike} className="flex items-center gap-1">
          <Heart className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : ""}`} />
          <span>{liked ? "Liked" : "Like"}</span>
        </button>
        <button onClick={handleSave} className="flex items-center gap-1">
          <Bookmark className={`w-5 h-5 ${saved ? "text-yellow-500 fill-yellow-500" : ""}`} />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}

export default WorkspacePost;

