import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";



export const wordStore = create(
  persist(
    (set, get) => ({
      words: [],
      isLoading: false,
      error: null,

      // Fetch words for a workspace
      setWords: async (workspaceId) => {
        if (!workspaceId) {
          set({ words: [] }); // Clear words if no workspace
          return;
        }
        
        set({ isLoading: true, error: null });
        try {
          const res = await axios.get(`http://localhost:2121/word/get/${workspaceId}`, {
            withCredentials: true,
          });
          set({ words: res.data.words || [], isLoading: false });
        } catch (error) {
          set({ 
            error: error?.response?.data?.message || "Failed to fetch words",
            isLoading: false 
          });
          console.error("Fetch words error:", error);
          throw error; // Re-throw for component handling
        }
      },
      updateWord: async (wordId, data) => {
        set({ isLoading: true });
        try {
          const res = await axios.put(`http://localhost:2121/word/edit/${wordId}`, data, {
            withCredentials: true,
          });
          set(state => ({
            words: state.words.map(w => 
              w._id === wordId ? { ...w, ...res.data.word } : w
            ),
            isLoading: false
          }));
          return res.data.word;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Simple favorite toggle
      toggleFavorite: async (wordId, favoriteStatus) => {
        set({ isLoading: true });
        try {
          console.log("Toggling favorite for word:", wordId, favoriteStatus);
          const res = await axios.patch(`http://localhost:2121/word/favorite/${wordId}`, {
            favorite: favoriteStatus
          }, {
            withCredentials: true,
          });

          set(state => ({
            words: state.words.map(w => 
              w._id === wordId ? { ...w, favorite:! favoriteStatus } : w
            ),
            isLoading: false
          }));
          return res.data.word;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    
      // Create new word
      createWord: async (data) => {
        set({ isLoading: true });
        try {
          const res = await axios.post("http://localhost:2121/word/create", data, {
            withCredentials: true,
          });
          set((state) => ({ 
            words: [res.data.word, ...state.words],
            isLoading: false 
          }));
          return res.data.word; // Return for immediate use
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Edit existing word
      editWord: async (wordId, data) => {
        set({ isLoading: true });
        try {
          const res = await axios.put(`http://localhost:2121/word/edit/${wordId}`, data, {
            withCredentials: true,
          });
          set((state) => ({
            words: state.words.map(w => 
              w._id === wordId ? res.data.word : w
            ),
            isLoading: false
          }));
          return res.data.word;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      //Delete a word
      deleteWord: async (wordId) => {
        set({ isLoading: true });
        try {
          await axios.delete(`http://localhost:2121/word/delete/${wordId}`, {
            withCredentials: true,
          });
          set((state) => ({
            words: state.words.filter(w => w._id !== wordId),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: "wordStore",
      getStorage: () => localStorage,
      // // Only persist what's necessary
      // partialize: (state) => ({ 
      //   /* optionally persist some state */
      // }),
    }
  )
);




