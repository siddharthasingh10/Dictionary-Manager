import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";

export const workspaceStore = create(
  persist(
    (set, get) => ({

        allworkspaces: [],
        usersWorkspaces: [],

        fetchAllWorkspaces:async()=>{
            try {
                const res=await axios.get('http://localhost:2121/workspace/all',{withCredentials:true});
                set({allworkspaces:res.data.workspaces});
                


            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to fetch workspaces");
                console.error("Fetch workspaces error:", error);
            }
        },

        createWorkspace:async(data)=>{
          try {
        
            const res=await axios.post('http://localhost:2121/workspace/create',data,{withCredentials:true});
            set((state) => ({ allworkspaces: [res.data.workspace,...state.allworkspaces] }));
            set((state) => ({ usersWorkspaces: [res.data.workspace,...state.usersWorkspaces] }));
            toast.success("Workspace created successfully!");
            
          } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create workspace");
            console.error("Create workspace error:", error);
          }
        },
        deleteWorkspace:async(workspaceId)=>{
          try {
        
            if(!workspaceId){
              toast.error("Please provide workspace id");
              return;
            }
            const res=await axios.delete(`http://localhost:2121/workspace/delete/${workspaceId}`,{withCredentials:true});
            set((state) => ({ allworkspaces: state.allworkspaces.filter(workspace => workspace._id !== workspaceId) }));
            set((state) => ({ usersWorkspaces: state.usersWorkspaces.filter(workspace => workspace._id !== workspaceId) }));
            toast.success("Workspace deleted successfully!");

          } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete workspace");
            console.error("Delete workspace error:", error);  
          }
        },
        updateWorkspace:async(workspaceId,data)=>{
          try {
        
            if(!workspaceId){
              toast.error("Please provide workspace id");
              return;
            }
            const res=await axios.put(`http://localhost:2121/workspace/edit/${workspaceId}`,data,{withCredentials:true});
            set((state) => ({ allworkspaces: state.allworkspaces.map(workspace => workspace._id === workspaceId ? res.data.workspace : workspace) }));
            set((state) => ({ usersWorkspaces: state.usersWorkspaces.map(workspace => workspace._id === workspaceId ? res.data.workspace : workspace) }));
            toast.success("Workspace updated successfully!");

          } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update workspace");
            console.error("Update workspace error:", error);  
          }
        },
        fetchUsersWorkspaces:async(userId)=>{
          try {
          
            const res=await axios.get(`http://localhost:2121/workspace/all/${userId}`,{withCredentials:true});
            set({usersWorkspaces:res.data.workspaces});
            


          } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch Users workspaces");
            console.error("Fetch workspaces error:", error);
          }
        },

     
     
    }),
    {
      name: "workspaceStore", 
      getStorage: () => localStorage,
    }
  )
);
