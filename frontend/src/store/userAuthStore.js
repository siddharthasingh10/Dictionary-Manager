


import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";



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


                    const res = await axios.post("http://localhost:2121/user/signup", data);

                    console.log(res)


                    set({ authUser: res.data.user })
                    toast.success("Signup successful!");

                } catch (error) {
                    toast.error(error?.response?.data?.message || "Signup failed");
                    console.error("Signup error:", error);
                } finally {
                    set({ isSigningUp: false });
                }
            },

            login: async () => { },
            logout: async () => { },
            checkAuth: async () => { },
        }),
        {
            name: "userAuthStore",
        }
    )
);
