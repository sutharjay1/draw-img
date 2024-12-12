import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Point {
  x: number;
  y: number;
}

interface DrawingLine {
  points: Point[];
  brushColor: string;
  brushRadius: number;
}

export interface Drawing {
  lines: DrawingLine[];
  width: number;
  height: number;
  time: Date;
  brushColor: string;
}

export interface DrawState {
  drawing: Drawing[];
  setDrawing: (drawing: Drawing) => void;
  undoDrawing: () => void;
  clearDrawing: () => void;
}

export const useDrawing = create<DrawState>()(
  persist(
    (set) => ({
      drawing: [
        {
          brushColor: "#000000",
          lines: [],
          width: 700,
          height: 400,
          time: new Date(),
        },
      ],

      setDrawing: (newDrawing) =>
        set((state) => {
          const lastDrawing = state.drawing[state.drawing.length - 1];
          const isLastDrawingEmpty = lastDrawing.lines.length === 0;

          if (isLastDrawingEmpty) {
            return {
              drawing: [...state.drawing.slice(0, -1), { ...newDrawing }],
            };
          }

          return {
            drawing: [...state.drawing, { ...newDrawing }],
          };
        }),

      undoDrawing: () =>
        set((state) => {
          const lastDrawing = state.drawing[state.drawing.length - 1];

          if (lastDrawing.lines.length === 0 && state.drawing.length > 1) {
            return {
              drawing: state.drawing.slice(0, -1),
            };
          }

          return {
            drawing: state.drawing.map((drawing, index) =>
              index === state.drawing.length - 1
                ? {
                    ...drawing,
                    lines: drawing.lines.slice(0, -1),
                    time: new Date(),
                  }
                : drawing,
            ),
          };
        }),

      clearDrawing: () =>
        set(() => ({
          drawing: [
            {
              brushColor: "#000000",
              lines: [],
              width: 700,
              height: 400,
              time: new Date(),
            },
          ],
        })),
    }),
    {
      name: "drawing-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
