import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";
import { workspaceStore } from "./workspaceStore"; // ✅ Correct import


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
                    const res = await axios.post("http://localhost:2121/user/signup", data,{withCredentials:true});

                    set({ authUser: res.data.user })
                    toast.success("Signup successful!");

                } catch (error) {
                    toast.error(error?.response?.data?.message || "Signup failed");
                    console.error("Signup error:", error);
                } finally {
                    set({ isSigningUp: false });
                }
            },

            login: async (data) => {
                set({ isLoggingIn: true });
              
                try {
                  const res = await axios.post("http://localhost:2121/user/login", data, {
                    withCredentials: true,
                  });
              
                  const user = res.data.user;
                  set({ authUser: user });
              
                  toast.success("Login successful!");
              
                } catch (error) {
                  toast.error(error?.response?.data?.message || "Login failed");
                  console.error("Login error:", error);
                } finally {
                  set({ isLoggingIn: false });
                }
              },
              
              logout: async () => {
                try {
                  await axios.post("http://localhost:2121/user/logout", {}, {
                    withCredentials: true,
                  });
              
                  set({ authUser: null });
              
                  toast.success("Logged out successfully!");
              
                } catch (error) {
                  toast.error(error?.response?.data?.message || "Logout failed");
                  console.error("Logout error:", error);
                }
              },
              
           


// checkAuth: async () => {
//   try {
//     const res = await axios.get("http://localhost:2121/user/me", {
//       withCredentials: true, 
//     });

  
//     const user = res.data;
//     set({ authUser: user, isCheckingAuth: false });

//   } catch (error) {
//     console.error("Auth check failed:", error.message);


//     if (error.response?.status === 401) {
//       set({ authUser: null, isCheckingAuth: false });
//     } else {
    
//       set({ authUser: null, isCheckingAuth: false });
//     }
//   }
// },
checkAuth: async () => {
  set({ isCheckingAuth: true }); // ✅ ye zaroori hai
  try {
    const res = await axios.get("http://localhost:2121/user/me", {
      withCredentials: true,
    });
    set({ authUser: res.data, isCheckingAuth: false });
  } catch (error) {
    console.error("Auth check failed:", error.message);
    set({ authUser: null, isCheckingAuth: false });
  }
}
,
initialize: async () => {
  set({ isCheckingAuth: true });
  try {
    const res = await axios.get("http://localhost:2121/user/me", {
      withCredentials: true,
    });
  
    set({ authUser: res.data.user });
    
    // Fetch workspaces after auth is confirmed
    if (res.data) {
      await workspaceStore.getState().fetchAllWorkspaces();
      await workspaceStore.getState().fetchUsersWorkspaces(res.data.user._id);
    }
  } catch (error) {
    set({ authUser: null });
  } finally {
    set({ isCheckingAuth: false });
  }
}
        }),
        {
            name: "userAuthStore",
            getStorage: () => localStorage,
        }
    )
);
