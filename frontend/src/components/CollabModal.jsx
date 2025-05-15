import { useState } from "react";
import { workspaceStore } from "../store/workspaceStore";


export default function CollabModal({ friends, onClose }) {
    
    const { selectedWorkspace, addCollaborators } = workspaceStore();
    const [email, setEmail] = useState("");
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [collaborators, setCollaborators] = useState([]);

    const toggleFriend = (friendId) => {
        setSelectedFriends((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleAddEmail = () => {
        if (email.trim()) {
            setCollaborators([...collaborators, email.trim()]);
            setEmail("");
        }
    };

    // const handleFinalAdd = async () => {
    //     const payload = {
    //         workspaceId: selectedWorkspace._id,
    //         emails: collaborators,
    //         friendIds: selectedFriends,
    //     };


    //     try {
    //         // console.log("Payload to send:", payload);
    //           await fetch("/api/add-collaborators", {
    //             method: "POST",
    //             headers: {
    //               "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //           });
    //           onClose(); 
    //     } catch (error) {
    //         console.error("Error adding collaborators:", error);
    //     }
    // };



const handleFinalAdd = async () => {
 

  const payload = {
    workspaceId: selectedWorkspace._id,
    emails: collaborators,
    friendIds: selectedFriends,
  };

  try {
    await addCollaborators(payload);
    onClose(); // close modal if success
  } catch (error) {
    console.error("Error adding collaborators:", error);
  }
};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="modal-box w-11/12 max-w-lg bg-base-100 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-4">Add Collaborators</h3>

                {/* Email Input */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="email"
                        placeholder="Enter collaborator's email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="btn" onClick={handleAddEmail}>
                        Add
                    </button>
                </div>

                {/* Friend List */}
                <div className="text-sm font-semibold mb-2">Select Friends:</div>
                <div className="overflow-y-auto max-h-80 border rounded p-2 mb-4">
                    {
                        friends.length === 0 ? (
                            <div className="text-center text-gray-500">
                                No friends available to add.
                            </div>
                        ) :
                            (friends.map((friend) => (
                                <div
                                    key={friend.id}
                                    className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded"
                                    onClick={() => toggleFriend(friend.id)}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 ${selectedFriends.includes(friend.id) ? "bg-primary" : ""
                                            }`}
                                    ></div>
                                    <span>{friend.name}</span>
                                </div>
                            )))

                    }

                </div>

                {/* Selected Emails */}
                {collaborators.length > 0 && (
                    <div className="mb-2">
                        <p className="text-sm font-semibold">Emails to Add:</p>
                        <ul className="list-disc ml-6 text-sm">
                            {collaborators.map((email, idx) => (
                                <li key={idx}>{email}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <button className="btn btn-primary" onClick={handleFinalAdd}>
                        Add Selected
                    </button>
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}



// import { useState } from "react";

// export default function CollabModal({ friends, onClose }) {
//   const [email, setEmail] = useState("");
//   const [selectedFriends, setSelectedFriends] = useState([]);
//   const [collaborators, setCollaborators] = useState([]);

//   const toggleFriend = (friendId) => {
//     setSelectedFriends((prev) =>
//       prev.includes(friendId)
//         ? prev.filter((id) => id !== friendId)
//         : [...prev, friendId]
//     );
//   };

//   const handleAddEmail = () => {
//     if (email.trim()) {
//       setCollaborators([...collaborators, email.trim()]);
//       setEmail("");
//     }
//   };

//   const handleFinalAdd = async () => {
//     const payload = {
//       emails: collaborators,
//       friendIds: selectedFriends,
//     };

//     // Call API
//     try {
//       await fetch("/api/add-collaborators", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//       // Optionally close modal or show success
//       onClose();
//     } catch (error) {
//       console.error("Error adding collaborators:", error);
//     }
//   };

//   return (
//     <>
//       <input type="checkbox" id="collab-modal" className="modal-toggle" />
//       <div className="modal">
//         <div className="modal-box w-11/12 max-w-lg">
//           <h3 className="font-bold text-lg mb-4">Add Collaborators</h3>

//           {/* Email Input */}
//           <div className="flex gap-2 mb-4">
//             <input
//               type="email"
//               placeholder="Enter collaborator's email"
//               className="input input-bordered w-full"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <button className="btn" onClick={handleAddEmail}>
//               Add
//             </button>
//           </div>

//           {/* Friend List */}
//           <div className="overflow-y-auto max-h-48 border rounded p-2 mb-4">
//             {friends.map((friend) => (
//               <div
//                 key={friend.id}
//                 className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded"
//                 onClick={() => toggleFriend(friend.id)}
//               >
//                 <div
//                   className={`w-4 h-4 rounded-full border-2 ${
//                     selectedFriends.includes(friend.id) ? "bg-primary" : ""
//                   }`}
//                 ></div>
//                 <span>{friend.name}</span>
//               </div>
//             ))}
//           </div>

//           {/* Selected Emails (Optional display) */}
//           {collaborators.length > 0 && (
//             <div className="mb-2">
//               <p className="text-sm font-semibold">Emails to Add:</p>
//               <ul className="list-disc ml-6 text-sm">
//                 {collaborators.map((email, idx) => (
//                   <li key={idx}>{email}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Final Add Button */}
//           <div className="modal-action">
//             <label htmlFor="collab-modal" className="btn" onClick={handleFinalAdd}>
//               Add Selected
//             </label>
//             <label htmlFor="collab-modal" className="btn btn-ghost" onClick={onClose}>
//               Cancel
//             </label>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
