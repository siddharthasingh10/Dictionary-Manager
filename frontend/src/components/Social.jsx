// import WorkspacePost from "./WorkspacePost";
// import {workspaceStore} from "../store/workspaceStore";

// function Social() {
 
//     const {allworkspaces} = workspaceStore();
//     console.log(allworkspaces);



//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
//       {allworkspaces.map((ws) => (
//         <WorkspacePost key={ws._id} workspace={ws} />
//       ))}
//     </div>
//   );
// }

// export default Social;



import WorkspacePost from "./WorkspacePost";
import { workspaceStore } from "../store/workspaceStore";

function Social() {
  const { allworkspaces } = workspaceStore();

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 p-4">
      {allworkspaces.map((ws) => (
        <WorkspacePost key={ws._id} workspace={ws} />
      ))}
    </div>
  );
}

export default Social;
