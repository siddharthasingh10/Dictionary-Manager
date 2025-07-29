// import React from 'react'
// import Workspace from  "./Workspace"
// import { workspaceStore } from '../store/workspaceStore'
// import { useEffect } from 'react'
// import CollabWorkspacecard from './CollabWorkspacecard';
// function Collab() {
//     const { collaboratedWorkspaces} = workspaceStore();

//     useEffect(() => {
        
//         workspaceStore.getState().fetchCollaboratedWorkspaces();
//     },[])
    
//   return (
//     <div>
//     {
//         collaboratedWorkspaces.length === 0 ? (
//             <div className="flex items-center justify-center h-screen">
//                 <h1 className="text-2xl font-bold">No one added you as a Collaborator </h1>
//             </div>
//         ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
//                 {collaboratedWorkspaces.map((ws) => (
//                     <CollabWorkspacecard key={ws._id} workspace={ws} />
//                 ))}
//             </div>
//         )
//     }
 
//     </div>
//   )
// }

// export default Collab



import React, { useEffect } from "react";
import { workspaceStore } from "../store/workspaceStore";
import CollabWorkspacecard from "./CollabWorkspacecard";

function Collab() {
  const { collaboratedWorkspaces } = workspaceStore();

  useEffect(() => {
    workspaceStore.getState().fetchCollaboratedWorkspaces();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Collaborated Workspaces
        </h2>

        {collaboratedWorkspaces.length === 0 ? (
          <div className="flex items-center justify-center h-60">
            <h1 className="text-xl font-semibold">
              No one added you as a Collaborator
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaboratedWorkspaces.map((ws) => (
              <CollabWorkspacecard key={ws._id} workspace={ws} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Collab;
