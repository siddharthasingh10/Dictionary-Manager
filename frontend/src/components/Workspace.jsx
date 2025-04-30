import { useState } from "react";
import WorkspaceCard from "./Workspacecard";
import CreateWorkspaceModal from "./Workspacemodal";

function WorkspacePage() {
    const [showModal, setShowModal] = useState(false);
  
    const dummyWorkspaces = [
            {
              _id: "1",
              title: "GRE Prep Workspace",
              description: "Words to prepare for GRE verbal section",
              owner: "John Doe",
              collaborators: ["Alice", "Bob"],
              words: new Array(30).fill("word")
            },
            {
              _id: "1",
              title: "GRE Prep Workspace",
              description: "Words to prepare for GRE verbal section",
              owner: "John Doe",
              collaborators: ["Alice", "Bob"],
              words: new Array(30).fill("word")
            }
           
          ];
  
    return (
      <div className="flex flex-col h-full bg-base-100">
        
        {/* Header */}
        <div className="sticky top-0 z-10 border-b">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold">Your Workspaces</h1>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary btn-sm"
            >
              + Create Workspace
            </button>
          </div>
        </div>
  
        {/* Grid Section */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dummyWorkspaces.map((workspace) => (
              <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
          </div>
        </div>
  
        {showModal && <CreateWorkspaceModal onClose={() => setShowModal(false)} />}
      </div>
    );
  }
  

export default WorkspacePage;
