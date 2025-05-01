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
        }

        createWorkspace:async(data)=>{
          try {
            const res
            
          } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create workspace");
            console.error("Create workspace error:", error);
          }
        }


     
     
    }),
    {
      name: "workspaceStore", 
      getStorage: () => localStorage,
    }
  )
);
