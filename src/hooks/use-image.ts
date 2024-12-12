import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ImageState {
  image: {
    original?: string;
    edited?: string;
  };
  setImage: ({
    original,
    edited,
  }: {
    original: string;
    edited: string;
  }) => void;
}

export const useImage = create<ImageState>()(
  persist(
    (set) => ({
      image: {
        original: "",
        edited: "",
      },
      setImage: ({
        original,
        edited,
      }: {
        original?: string;
        edited?: string;
      }) => {
        set({ image: { original, edited } });
      },
    }),

    { name: "image", storage: createJSONStorage(() => localStorage) },
  ),
);
