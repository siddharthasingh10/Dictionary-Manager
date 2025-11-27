import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";
import { workspaceStore } from "./workspaceStore";

const API = import.meta.env.VITE_API_URL;

export const userAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isCheckingAuth: false,

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axios.post(`${API}/user/signup`, data, {
            withCredentials: true,
          });

          set({ authUser: res.data.user });
          toast.success("Signup Successful!");
        } catch (error) {
          toast.error(error?.response?.data?.message || "Signup failed");
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axios.post(`${API}/user/login`, data, {
            withCredentials: true,
          });

          set({ authUser: res.data.user });
          toast.success("Login successful!");
        } catch (error) {
          toast.error(error?.response?.data?.message || "Login failed");
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axios.post(
            `${API}/user/logout`,
            {},
            { withCredentials: true }
          );

          set({ authUser: null });
          toast.success("Logged out");
        } catch (error) {
          toast.error("Logout failed");
        }
      },

      addFriend: async (email) => {
        try {
          const res = await axios.post(
            `${API}/user/add-friend`,
            { email },
            { withCredentials: true }
          );

          set((state) => ({
            authUser: { ...state.authUser, friends: res.data.friends },
          }));

          toast.success(res.data.message);
        } catch (error) {
          toast.error("Failed to add friend");
        }
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await axios.get(`${API}/user/me`, {
            withCredentials: true,
          });

          set({ authUser: res.data.user, isCheckingAuth: false });
        } catch {
          set({ authUser: null, isCheckingAuth: false });
        }
      },

      initialize: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await axios.get(`${API}/user/me`, {
            withCredentials: true,
          });

          const user = res.data.user;
          set({ authUser: user });

          if (user?._id) {
            await workspaceStore.getState().fetchAllWorkspaces();
            await workspaceStore.getState().fetchAllSavedWorkspaces(user._id);
            await workspaceStore.getState().fetchUsersWorkspaces(user._id);
          }
        } catch {
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },
    }),
    { name: "userAuthStore", getStorage: () => localStorage }
  )
);




// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { workspaceStore } from "./workspaceStore";

// const API = import.meta.env.VITE_API_URL;

// export const userAuthStore = create(
//   persist(
//     (set, get) => ({
//       authUser: null,
//       isSigningUp: false,
//       isLoggingIn: false,
//       isCheckingAuth: false,

      
//       signup: async (data) => {
//         set({ isSigningUp: true });
//         try {
//           const res = await axios.post(`${API}/user/signup`, data, {
//             withCredentials: true,
//           });

//           set({ authUser: res.data.user });
//           toast.success("Signup Successful!");
//         } catch (error) {
//           toast.error(error?.response?.data?.message || "Signup failed");
//         } finally {
//           set({ isSigningUp: false });
//         }
//       },

//       login: async (data) => {
//         set({ isLoggingIn: true });
//         try {
//           const res = await axios.post(`${API}/user/login`, data, {
//             withCredentials: true,
//           });

//           set({ authUser: res.data.user });
//           toast.success("Login successful!");
//         } catch (error) {
//           toast.error(error?.response?.data?.message || "Login failed");
//         } finally {
//           set({ isLoggingIn: false });
//         }
//       },

   
//       logout: async () => {
//         try {
//           await axios.post(
//             `${API}/user/logout`,
//             {},
//             { withCredentials: true }
//           );

//           set({ authUser: null });
//           toast.success("Logged out");
//         } catch (error) {
//           toast.error("Logout failed");
//         }
//       },

   
//       addFriend: async (email) => {
//         try {
//           const res = await axios.post(
//             `${API}/user/add-friend`,
//             { email },
//             { withCredentials: true }
//           );

//           set((state) => ({
//             authUser: { ...state.authUser, friends: res.data.friends },
//           }));

//           toast.success(res.data.message);
//         } catch (error) {
//           toast.error("Failed to add friend");
//         }
//       },

 
//       checkAuth: async () => {
//         set({ isCheckingAuth: true });
//         try {
//           const res = await axios.get(`${API}/user/me`, {
//             withCredentials: true,
//           });

//           // IMPORTANT FIX
//           set({ authUser: res.data.user, isCheckingAuth: false });
//         } catch {
//           set({ authUser: null, isCheckingAuth: false });
//         }
//       },

   
//       initialize: async () => {
//         set({ isCheckingAuth: true });
//         try {
//           const res = await axios.get(`${API}/user/me`, {
//             withCredentials: true,
//           });

//           const user = res.data.user;
//           set({ authUser: user });

//           // Fetch user-specific data
//           if (user?._id) {
//             await workspaceStore.getState().fetchAllWorkspaces();
//             await workspaceStore.getState().fetchAllSavedWorkspaces(user._id);
//             await workspaceStore.getState().fetchUsersWorkspaces(user._id);
//           }
//         } catch {
//           set({ authUser: null });
//         } finally {
//           set({ isCheckingAuth: false });
//         }
//       },
//     }),
//     { name: "userAuthStore", getStorage: () => localStorage }
//   )
// );
