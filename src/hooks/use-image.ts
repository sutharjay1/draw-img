import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ImageState {
  image: {
    original?: string;
    edited?: string;
    mask?: string;
  };
  setImage: ({
    original,
    edited,
    mask,
  }: {
    original?: string;
    edited?: string;
    mask?: string;
  }) => void;
}

export const useImage = create<ImageState>()(
  persist(
    (set) => ({
      image: {
        original: "",
        edited: "",
        mask: "",
      },
      setImage: ({
        original,
        edited,
        mask,
      }: {
        original?: string;
        edited?: string;
        mask?: string;
      }) => {
        set({ image: { original, edited, mask } });
      },
    }),

    { name: "image", storage: createJSONStorage(() => localStorage) },
  ),
);
