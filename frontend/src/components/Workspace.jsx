import { useState } from "react";
import WorkspaceCard from "./Workspacecard";
import Workspacemodal from "./Workspacemodal";
import {workspaceStore} from "../store/workspaceStore"



function WorkspacePage() {
    const [showModal, setShowModal] = useState(false);
    const {usersWorkspaces}=workspaceStore();

  
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
            {usersWorkspaces.map((workspace) => (
              <WorkspaceCard key={workspace._id} workspace={workspace}   />
            ))}
          </div>
        </div>
  
        {showModal && <Workspacemodal onClose={() => setShowModal(false)} />}
      </div>
    );
  }
  

export default WorkspacePage;
