

import WorkspacePost from "./WorkspacePost";
import { workspaceStore } from "../store/workspaceStore";

function Social() {
  const { allworkspaces } = workspaceStore();


  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 p-4">
      {allworkspaces &&
        allworkspaces
          .filter((ws) => ws !== null && ws !== undefined)  // keep only non-null workspaces
          .map((ws) => (
            <WorkspacePost key={ws._id} workspace={ws} />
          ))
      }
    </div>
  );
}

export default Social;


// import WorkspacePost from "./WorkspacePost";
// import { workspaceStore } from "../store/workspaceStore";

// function Social() {
//   const { allworkspaces } = workspaceStore();
//   console.log(allworkspaces);

//   return (
//     <div className="max-w-xl mx-auto flex flex-col gap-6 p-4">
//       {allworkspaces.map((ws) => (
       
//          <WorkspacePost key={ws._id} workspace={ws} />
         
//       ))}
//     </div>
//   );
// }

// export default Social;
