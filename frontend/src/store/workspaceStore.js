import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";
import { wordStore } from "./wordStore"; // ✅ Correct import

export const workspaceStore = create(
  persist(
    (set, get) => ({

      allworkspaces: [],
      usersWorkspaces: [],
      selectedWorkspace: null,
      isLoading: false,

      fetchAllWorkspaces: async () => {
        try {
          const res = await axios.get("http://localhost:2121/workspace/all", {
            withCredentials: true,
          });
          set({ allworkspaces: res.data.workspaces });
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to fetch workspaces");
          console.error("Fetch workspaces error:", error);
        }
      },

      createWorkspace: async (data) => {
        try {
          const res = await axios.post("http://localhost:2121/workspace/create", data, {
            withCredentials: true,
          });
          set((state) => ({
            allworkspaces: [res.data.workspace, ...state.allworkspaces],
            usersWorkspaces: [res.data.workspace, ...state.usersWorkspaces],
          }));
          toast.success("Workspace created successfully!");
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to create workspace");
          console.error("Create workspace error:", error);
        }
      },

      deleteWorkspace: async (workspaceId) => {
        try {
          if (!workspaceId) {
            toast.error("Please provide workspace id");
            return;
          }
          await axios.delete(`http://localhost:2121/workspace/delete/${workspaceId}`, {
            withCredentials: true,
          });
          set((state) => ({
            allworkspaces: state.allworkspaces.filter((w) => w._id !== workspaceId),
            usersWorkspaces: state.usersWorkspaces.filter((w) => w._id !== workspaceId),
          }));
          toast.success("Workspace deleted successfully!");
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to delete workspace");
          console.error("Delete workspace error:", error);
        }
      },

      updateWorkspace: async (workspaceId, data) => {
        try {
          if (!workspaceId) {
            toast.error("Please provide workspace id");
            return;
          }
          const res = await axios.put(`http://localhost:2121/workspace/edit/${workspaceId}`, data, {
            withCredentials: true,
          });
          set((state) => ({
            allworkspaces: state.allworkspaces.map((w) =>
              w._id === workspaceId ? res.data.workspace : w
            ),
            usersWorkspaces: state.usersWorkspaces.map((w) =>
              w._id === workspaceId ? res.data.workspace : w
            ),
          }));
          toast.success("Workspace updated successfully!");
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to update workspace");
          console.error("Update workspace error:", error);
        }
      },

      fetchUsersWorkspaces: async (userId) => {
        try {
          const res = await axios.get(`http://localhost:2121/workspace/all/${userId}`, {
            withCredentials: true,
          });
          set({ usersWorkspaces: res.data.workspaces });
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to fetch user's workspaces");
          console.error("Fetch user's workspaces error:", error);
        }
      },

      fetchWorkspaceById: async (workspaceId) => {
        set({ isLoading: true });
        try {
          const res = await axios.get(`http://localhost:2121/workspace/${workspaceId}`, {
            withCredentials: true,
          });
     

          //  Set words in wordStore
          const { setWords } = wordStore.getState();
          setWords(workspaceId);

          //  Set selected workspace
          set({ selectedWorkspace: res.data.workspace});

        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to fetch workspace");
          console.error("Fetch workspace error:", error);
        }finally {  
          set({ isLoading: false });
        }
      },


addCollaborators: async (payload) => {
  try {
    const { workspaceId, friendIds, emails } = payload;
    console.log("Adding collaborators with payload:", payload);
    console.log("Workspace ID:", workspaceId);
    console.log("Friend IDs:", friendIds);
    console.log("Emails:", emails);
    if (!workspaceId) {
      toast.error("Please provide workspace id");
      return;
    }

    const res = await axios.post(
      `http://localhost:2121/workspace/add-collaborators`,
      { workspaceId, emails, friendIds },
      { withCredentials: true }
    );

    const updatedWorkspace = res.data.updatedWorkspace;


    // Update all relevant parts of Zustand store
    set((state) => {
      const updatedAll = state.allworkspaces.map((w) =>
        w._id === workspaceId ? updatedWorkspace : w
      );
      const updatedUser = state.usersWorkspaces.map((w) =>
        w._id === workspaceId ? updatedWorkspace : w
      );

      const isSelected = state.selectedWorkspace?._id === workspaceId;

      return {
        allworkspaces: updatedAll,
        usersWorkspaces: updatedUser,
        selectedWorkspace: isSelected ? updatedWorkspace : state.selectedWorkspace,
      };
    });

    // ✅ Optional but recommended: re-fetch full workspace to ensure complete sync
    await get().fetchWorkspaceById(workspaceId);

    toast.success("Collaborators added successfully!");
  } catch (error) {
    toast.error(error?.response?.data?.error || "Failed to add collaborators");
    console.error("Add collaborators error:", error);
  }
},



    }),
    {
      name: "workspaceStore",
      getStorage: () => localStorage,
    }
  )
);
