
import React, { useState } from 'react';
import VocabularyTable from './VocabularyTable';
import { UserIcon, UsersIcon, GlobeIcon, BookOpenIcon } from 'lucide-react';
import { workspaceStore } from '../store/workspaceStore';
import CollabModal from './CollabModal';
import { userAuthStore } from '../store/userAuthStore';

function DictionaryOverview() {
  const {authUser}=userAuthStore();
  console.log(authUser);
  const { isLoading, selectedWorkspace } = workspaceStore();
  const [showModal, setShowModal] = useState(false);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-500">Loading...</p>
    </div>
  ) : (
    <div className="p-4 pt-0 space-y-6">
      {/* Top overview card */}
      <div className="bg-base-100 shadow-lg rounded-xl p-6 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">{selectedWorkspace.title}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Author */}
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">Author:</span>
            <span className="text-sm">{selectedWorkspace.author.fullName}</span>
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-2">
            <GlobeIcon className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">Visibility:</span>
            <span className="text-sm">
              {selectedWorkspace.isPublic ? 'Public' : 'Private'}
            </span>
          </div>

          {/* Number of Words */}
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">Words:</span>
            <span className="text-sm">{selectedWorkspace.words.length}</span>
          </div>

          {/* Collaborators */}
          <div className="flex items-start gap-2 col-span-full">
            <UsersIcon className="w-5 h-5 text-secondary mt-1" />
            <div>
              <span className="text-sm font-medium">Collaborators:</span>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {selectedWorkspace.collaborators.map((collab, index) => (
                  <li key={index}>
                    {collab.fullName} ({collab.email})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Add Collaborator Button */}
          <div className="flex items-center gap-2">
            <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
              Add a Collaborator
            </button>
          </div>
        </div>
      </div>

      {/* Modal Rendering */}
      {showModal && (
        <CollabModal
          friends={authUser.friends}
                     onClose={() => setShowModal(false)}
        />
      )}

      {/* Vocabulary Table */}
      <div className="bg-base-100 shadow-md rounded-xl p-4">
        <VocabularyTable />
      </div>
    </div>
  );
}

export default DictionaryOverview;


// import React, { useState } from 'react';
// import VocabularyTable from './VocabularyTable';
// import { UserIcon, UsersIcon, GlobeIcon, BookOpenIcon } from 'lucide-react';
// import { workspaceStore } from '../store/workspaceStore';
// import CollabModal from './CollabModal';
// function DictionaryOverview() {
  

//   const {isLoading,selectedWorkspace }=workspaceStore();
//   const [showModal, setShowModal] = useState(false);
//   console.log(showModal)
  
//   return (

    
//       (isLoading) ? <div className="flex items-center justify-center h-screen"><p className="text-lg text-gray-500">Loading...</p></div> :
    
//     <div className="p-4 pt-0  space-y-6">
//       {/* Top overview card */}
//       <div className="bg-base-100 shadow-lg rounded-xl p-6 space-y-4">
//         <div>
//           <h1 className="text-3xl font-bold text-primary">{selectedWorkspace.title}</h1>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {/* Author */}
//           <div className="flex items-center gap-2">
//             <UserIcon className="w-5 h-5 text-secondary" />
//             <span className="text-sm font-medium">Author:</span>
//             <span className="text-sm">{selectedWorkspace.author.fullName}</span>
//           </div>

//           {/* Visibility */}
//           <div className="flex items-center gap-2">
//             <GlobeIcon className="w-5 h-5 text-secondary" />
//             <span className="text-sm font-medium">Visibility:</span>
//             <span className="text-sm">
//               {selectedWorkspace.isPublic ? 'Public' : 'Private'}
//             </span>
//           </div>

//           {/* Number of Words */}
//           <div className="flex items-center gap-2">
//             <BookOpenIcon className="w-5 h-5 text-secondary" />
//             <span className="text-sm font-medium">Words:</span>
//             <span className="text-sm">{selectedWorkspace.words.length}</span>
//           </div>
         

//           {/* Collaborators */}
//           <div className="flex items-start gap-2 col-span-full">
//             <UsersIcon className="w-5 h-5 text-secondary mt-1" />
//             <div>
//               <span className="text-sm font-medium">Collaborators:</span>
//               <ul className="list-disc list-inside text-sm text-gray-600">
//                 {selectedWorkspace.collaborators.map((collab, index) => (
//                   <li key={index}>{collab.fullName} ({collab.email})</li>
//                 ))}
//               </ul>
//             </div>
        
//           </div>
//         <div className="flex items-center gap-2">
//           <button onClick={()=>setShowModal(true)} className='btn btn-primary btn-sm'>Add a Collaborator</button>
//           </div>
//         </div>
//       </div>
// {/*       
// <CollabModal  friends={[
//     { id: "1", name: "Alice" },
//     { id: "2", name: "Bob" },
//     { id: "3", name: "Charlie" },
//     // ...more friends
//   ]}
//   onClose={() => console.log("Modal closed")}/> */}


//   {showModal && (
//   <CollabModal friends={[
//     { id: "1", name: "Alice" },
//     { id: "2", name: "Bob" },
//     { id: "3", name: "Charlie" },
   
//   ]}
//    onClose={() => setShowModal(false)} />
// )}



//       {/* Vocabulary Table */}
//       <div className="bg-base-100 shadow-md rounded-xl p-4">
//         <VocabularyTable />
//       </div>
//     </div>
    
//   );
// }

// export default DictionaryOverview;
