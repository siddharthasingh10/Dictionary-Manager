import React from 'react';
import { workspaceStore } from '../store/workspaceStore';
import SavedWorkspaceCard from '../components/SavedWorkspaceCard'; // adjust path if needed

function Savedworkspace() {
  const { savedWorkspaces } = workspaceStore();

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Saved Workspaces</h1>
      {savedWorkspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {savedWorkspaces.map((workspace) => (
            <SavedWorkspaceCard key={workspace._id} workspace={workspace} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No saved workspaces found.</p>
      )}
    </div>
  );
}

export default Savedworkspace;



// import React from 'react';
// import { workspaceStore } from '../store/workspaceStore';
// import SavedWorkspaceCard from '../components/SavedWorkspaceCard'; // adjust path if needed

// function Savedworkspace() {
//   const { savedWorkspaces } = workspaceStore();

//   return (
//     <div className="flex flex-col items-center py-8 px-4">
//       <h1 className="text-2xl font-bold mb-6">Saved Workspaces</h1>
//       {savedWorkspaces.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
//           {savedWorkspaces.map((workspace) => (
//             <SavedWorkspaceCard key={workspace._id} workspace={workspace} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No saved workspaces found.</p>
//       )}
//     </div>
//   );
// }

// export default Savedworkspace;
