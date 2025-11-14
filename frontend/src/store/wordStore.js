import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const wordStore = create(
  persist(
    (set, get) => ({
      words: [],
      isLoading: false,
      error: null,

      setWords: async (workspaceId) => {
        if (!workspaceId) {
          set({ words: [] });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const res = await axios.get(`${API}/word/get/${workspaceId}`, {
            withCredentials: true,
          });
          set({ words: res.data.words || [], isLoading: false });
        } catch (error) {
          set({
            error: error?.response?.data?.message || "Failed to fetch words",
            isLoading: false,
          });
          throw error;
        }
      },

      updateWord: async (wordId, data) => {
        set({ isLoading: true });
        try {
          const res = await axios.put(`${API}/word/edit/${wordId}`, data, {
            withCredentials: true,
          });
          set((state) => ({
            words: state.words.map((w) =>
              w._id === wordId ? { ...w, ...res.data.word } : w
            ),
            isLoading: false,
          }));
          return res.data.word;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      toggleFavorite: async (wordId, favoriteStatus) => {
        set({ isLoading: true });
        try {
          const res = await axios.patch(
            `${API}/word/favorite/${wordId}`,
            { favorite: favoriteStatus },
            { withCredentials: true }
          );

          set((state) => ({
            words: state.words.map((w) =>
              w._id === wordId ? { ...w, favorite: !favoriteStatus } : w
            ),
            isLoading: false,
          }));
          return res.data.word;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      createWord: async (data) => {
        set({ isLoading: true });
        try {
          const res = await axios.post(`${API}/word/create`, data, {
            withCredentials: true,
          });
          set((state) => ({
            words: [res.data.word, ...state.words],
            isLoading: false,
          }));
          return res.data.word;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      editWord: async (wordId, data) => {
        set({ isLoading: true });
        try {
          const res = await axios.put(`${API}/word/edit/${wordId}`, data, {
            withCredentials: true,
          });
          set((state) => ({
            words: state.words.map((w) =>
              w._id === wordId ? res.data.word : w
            ),
            isLoading: false,
          }));
          return res.data.word;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteWord: async (wordId) => {
        set({ isLoading: true });
        try {
          await axios.delete(`${API}/word/delete/${wordId}`, {
            withCredentials: true,
          });
          set((state) => ({
            words: state.words.filter((w) => w._id !== wordId),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addWordFromAi: async (wordObj, workspaceId) => {
        const existing = get().words.find(
          (w) => w.word.toLowerCase() === wordObj.word.toLowerCase()
        );
        if (existing) {
          toast.error("Word already exists");
          return;
        }

        try {
          const res = await axios.post(
            `${API}/word/create`,
            { ...wordObj, workspaceId },
            { withCredentials: true }
          );

          set((state) => ({
            words: [res.data.word, ...state.words],
          }));
          toast.success("Word added!");
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to add word");
        }
      },
    }),
    {
      name: "wordStore",
      getStorage: () => localStorage,
    }
  )
);



