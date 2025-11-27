import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const workspaceStore = create(
  persist(
    (set, get) => ({
      allworkspaces: [],
      usersWorkspaces: [],
      selectedWorkspace: null,
      collaboratedWorkspaces: [],
      savedWorkspaces: [],
      isLoading: false,

      fetchAllWorkspaces: async () => {
        try {
          const res = await axios.get(`${API}/workspace/all`, {
            withCredentials: true,
          });
          set({ allworkspaces: res.data.workspaces });
        } catch {
          toast.error("Failed to fetch workspaces");
        }
      },

      fetchUsersWorkspaces: async (userId) => {
        try {
          const res = await axios.get(`${API}/workspace/user/${userId}`, {
            withCredentials: true,
          });
          set({ usersWorkspaces: res.data.workspaces });
        } catch {
          toast.error("Failed to fetch user workspaces");
        }
      },

      fetchWorkspaceById: async (workspaceId) => {
        set({ isLoading: true });
        try {
          const res = await axios.get(
            `${API}/workspace/view/${workspaceId}`,
            { withCredentials: true }
          );
          set({ selectedWorkspace: res.data.workspace });
        } catch {
          toast.error("Failed to fetch workspace");
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCollaboratedWorkspaces: async () => {
        try {
          const res = await axios.get(`${API}/workspace/collaborated`, {
            withCredentials: true,
          });
          set({ collaboratedWorkspaces: res.data.workspaces });
        } catch {}
      },

      fetchAllSavedWorkspaces: async (userId) => {
        try {
          const res = await axios.get(`${API}/workspace/saved/${userId}`, {
            withCredentials: true,
          });
          set({ savedWorkspaces: res.data.savedWorkspaces });
        } catch {
          toast.error("Failed to fetch saved workspaces");
        }
      },

      createWorkspace: async (data) => {
        try {
          const res = await axios.post(`${API}/workspace/create`, data, {
            withCredentials: true,
          });

          set((state) => ({
            allworkspaces: [res.data.workspace, ...state.allworkspaces],
            usersWorkspaces: [res.data.workspace, ...state.usersWorkspaces],
          }));

          toast.success("Workspace created!");
        } catch {
          toast.error("Failed to create workspace");
        }
      },

      deleteWorkspace: async (workspaceId) => {
        try {
          await axios.delete(`${API}/workspace/delete/${workspaceId}`, {
            withCredentials: true,
          });

          set((state) => ({
            allworkspaces: state.allworkspaces.filter((w) => w._id !== workspaceId),
            usersWorkspaces: state.usersWorkspaces.filter((w) => w._id !== workspaceId),
          }));

          toast.success("Workspace deleted!");
        } catch {
          toast.error("Delete failed");
        }
      },

      updateWorkspace: async (workspaceId, data) => {
        try {
          const res = await axios.put(
            `${API}/workspace/edit/${workspaceId}`,
            data,
            { withCredentials: true }
          );

          set((state) => ({
            allworkspaces: state.allworkspaces.map((w) =>
              w._id === workspaceId ? res.data.workspace : w
            ),
            usersWorkspaces: state.usersWorkspaces.map((w) =>
              w._id === workspaceId ? res.data.workspace : w
            ),
            selectedWorkspace:
              state.selectedWorkspace?._id === workspaceId
                ? res.data.workspace
                : state.selectedWorkspace,
          }));

          toast.success("Updated!");
        } catch {
          toast.error("Update failed");
        }
      },

      likeOrdislikeWorkspace: async (workspaceId, action) => {
        try {
          const res = await axios.post(
            `${API}/workspace/${action}/${workspaceId}`,
            {},
            { withCredentials: true }
          );

          const updated = res.data.workspace;

          set((state) => ({
            allworkspaces: state.allworkspaces.map((w) =>
              w._id === workspaceId ? updated : w
            ),
            usersWorkspaces: state.usersWorkspaces.map((w) =>
              w._id === workspaceId ? updated : w
            ),
            selectedWorkspace:
              state.selectedWorkspace?._id === workspaceId
                ? updated
                : state.selectedWorkspace,
          }));
        } catch {
          toast.error("Action failed");
        }
      },

      saveWorkspace: async (workspaceId) => {
        try {
          const res = await axios.post(
            `${API}/workspace/save/${workspaceId}`,
            {},
            { withCredentials: true }
          );

          const updated = res.data.workspace;
          const saved = get().savedWorkspaces;

          const isSaved = saved.some((w) => w._id === workspaceId);

          set((state) => ({
            savedWorkspaces: isSaved
              ? saved.filter((w) => w._id !== workspaceId)
              : [updated, ...saved],

            allworkspaces: state.allworkspaces.map((w) =>
              w._id === workspaceId ? updated : w
            ),
            usersWorkspaces: state.usersWorkspaces.map((w) =>
              w._id === workspaceId ? updated : w
            ),
            selectedWorkspace:
              state.selectedWorkspace?._id === workspaceId
                ? updated
                : state.selectedWorkspace,
          }));

          toast.success(isSaved ? "Unsaved" : "Saved");
        } catch {
          toast.error("Failed to save workspace");
        }
      },
    }),
    { name: "workspaceStore", getStorage: () => localStorage }
  )
);



// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { wordStore } from "./wordStore";

// const API = import.meta.env.VITE_API_URL;

// export const workspaceStore = create(
//   persist(
//     (set, get) => ({
//       allworkspaces: [],
//       usersWorkspaces: [],
//       selectedWorkspace: null,
//       collaboratedWorkspaces: [],
//       savedWorkspaces: [],
//       isLoading: false,
//       aiPrompt: "",
//       aiWords: [],
//       isLoadingAi: false,

//       setAiPrompt: (prompt) => set({ aiPrompt: prompt }),

//       askAiFromPrompt: async (prompt) => {
//         set({ isLoadingAi: true });
//         try {
//           const res = await axios.post(
//             `${API}/ai/ask-ai`,
//             { prompt },
//             { withCredentials: true }
//           );

//           const words = Array.isArray(res.data.data) ? res.data.data : [];
//           set({ aiWords: words, isLoadingAi: false });
//         } catch (error) {
//           set({ isLoadingAi: false });
//           toast.error(error?.response?.data?.message || "AI failed");
//         }
//       },

//       clearAiSuggestions: () => set({ aiWords: [], aiPrompt: "" }),

//       fetchAllWorkspaces: async () => {
//         try {
//           const res = await axios.get(`${API}/workspace/all`, {
//             withCredentials: true,
//           });
//           set({ allworkspaces: res.data.workspaces });
//         } catch (error) {
//           toast.error("Failed to fetch workspaces");
//         }
//       },

//       fetchAllSavedWorkspaces: async (userId) => {
//         try {
//           const res = await axios.get(
//             `${API}/workspace/${userId}/allsaved`,
//             { withCredentials: true }
//           );
//           set({ savedWorkspaces: res.data.savedWorkspaces });
//         } catch (error) {
//           toast.error("Failed to fetch saved workspaces");
//         }
//       },

//       createWorkspace: async (data) => {
//         try {
//           const res = await axios.post(`${API}/workspace/create`, data, {
//             withCredentials: true,
//           });

//           set((state) => ({
//             allworkspaces: [res.data.workspace, ...state.allworkspaces],
//             usersWorkspaces: [res.data.workspace, ...state.usersWorkspaces],
//           }));

//           toast.success("Workspace created!");
//         } catch (error) {
//           toast.error("Failed to create workspace");
//         }
//       },

//       deleteWorkspace: async (workspaceId) => {
//         try {
//           await axios.delete(`${API}/workspace/delete/${workspaceId}`, {
//             withCredentials: true,
//           });

//           set((state) => ({
//             allworkspaces: state.allworkspaces.filter(
//               (w) => w._id !== workspaceId
//             ),
//             usersWorkspaces: state.usersWorkspaces.filter(
//               (w) => w._id !== workspaceId
//             ),
//           }));

//           toast.success("Workspace deleted!");
//         } catch (error) {
//           toast.error("Delete failed");
//         }
//       },

//       updateWorkspace: async (workspaceId, data) => {
//         try {
//           const res = await axios.put(
//             `${API}/workspace/edit/${workspaceId}`,
//             data,
//             { withCredentials: true }
//           );

//           set((state) => ({
//             allworkspaces: state.allworkspaces.map((w) =>
//               w._id === workspaceId ? res.data.workspace : w
//             ),
//             usersWorkspaces: state.usersWorkspaces.map((w) =>
//               w._id === workspaceId ? res.data.workspace : w
//             ),
//           }));

//           toast.success("Updated!");
//         } catch (error) {
//           toast.error("Update failed");
//         }
//       },

//       fetchUsersWorkspaces: async (userId) => {
//         try {
//           const res = await axios.get(
//             `${API}/workspace/all/${userId}`,
//             { withCredentials: true }
//           );
//           set({ usersWorkspaces: res.data.workspaces });
//         } catch (error) {
//           toast.error("Failed to fetch");
//         }
//       },

//       fetchWorkspaceById: async (workspaceId) => {
//         set({ isLoading: true });
//         try {
//           const res = await axios.get(`${API}/workspace/${workspaceId}`, {
//             withCredentials: true,
//           });

//           wordStore.getState().setWords(workspaceId);
//           set({ selectedWorkspace: res.data.workspace });
//         } catch (error) {
//           toast.error("Failed to fetch workspace");
//         } finally {
//           set({ isLoading: false });
//         }
//       },

//       fetchCollaboratedWorkspaces: async () => {
//         try {
//           const res = await axios.get(`${API}/workspace/collaborated`, {
//             withCredentials: true,
//           });
//           set({ collaboratedWorkspaces: res.data.workspaces });
//         } catch (error) {
//           console.log("Error fetching collaborated");
//         }
//       },

//       addCollaborators: async (payload) => {
//         try {
//           const res = await axios.post(
//             `${API}/workspace/add-collaborators`,
//             payload,
//             { withCredentials: true }
//           );

//           const updated = res.data.updatedWorkspace;

//           set((state) => ({
//             allworkspaces: state.allworkspaces.map((w) =>
//               w._id === updated._id ? updated : w
//             ),
//             usersWorkspaces: state.usersWorkspaces.map((w) =>
//               w._id === updated._id ? updated : w
//             ),
//             selectedWorkspace:
//               state.selectedWorkspace?._id === updated._id
//                 ? updated
//                 : state.selectedWorkspace,
//           }));

//           toast.success("Collaborators added!");
//         } catch (error) {
//           toast.error("Failed to add collaborators");
//         }
//       },

//       likeOrdislikeWorkspace: async (workspaceId, action) => {
//         try {
//           const res = await axios.post(
//             `${API}/workspace/${workspaceId}/${action}`,
//             {},
//             { withCredentials: true }
//           );

//           const updated = res.data.workspace;

//           set((state) => ({
//             allworkspaces: state.allworkspaces.map((w) =>
//               w._id === workspaceId ? updated : w
//             ),
//             usersWorkspaces: state.usersWorkspaces.map((w) =>
//               w._id === workspaceId ? updated : w
//             ),
//             selectedWorkspace:
//               state.selectedWorkspace?._id === workspaceId
//                 ? updated
//                 : state.selectedWorkspace,
//           }));
//         } catch {
//           toast.error("Action failed");
//         }
//       },

//       saveWorkspace: async (workspaceId) => {
//         try {
//           const res = await axios.post(
//             `${API}/workspace/${workspaceId}/save`,
//             {},
//             { withCredentials: true }
//           );

//           const updated = res.data.workspace;
//           const saved = get().savedWorkspaces;

//           const isSaved = saved.some((w) => w._id === workspaceId);

//           set((state) => ({
//             savedWorkspaces: isSaved
//               ? saved.filter((w) => w._id !== workspaceId)
//               : [updated, ...saved],

//             allworkspaces: state.allworkspaces.map((w) =>
//               w._id === workspaceId ? updated : w
//             ),
//             usersWorkspaces: state.usersWorkspaces.map((w) =>
//               w._id === workspaceId ? updated : w
//             ),
//             selectedWorkspace:
//               state.selectedWorkspace?._id === workspaceId
//                 ? updated
//                 : state.selectedWorkspace,
//           }));

//           toast.success(isSaved ? "Unsaved" : "Saved");
//         } catch {
//           toast.error("Failed to save workspace");
//         }
//       },
//     }),
//     { name: "workspaceStore", getStorage: () => localStorage }
//   )
// );
