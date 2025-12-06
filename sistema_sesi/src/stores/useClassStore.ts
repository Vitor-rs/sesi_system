import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Class {
  id: string;
  name: string; // Auto-generated: "${grade} ${letter}"
  grade: string; // e.g., "4º Ano"
  letter: string; // e.g., "A"
  period: "Matutino" | "Vespertino" | "Noturno";
}

interface ClassState {
  classes: Class[];
  addClass: (cls: Omit<Class, "id" | "name">) => void;
  removeClass: (id: string) => void;
  updateClass: (id: string, cls: Partial<Omit<Class, "id" | "name">>) => void;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set) => ({
      classes: [],
      addClass: ({ grade, letter, period }) =>
        set((state) => {
          const name = `${grade} ${letter}`;
          return {
            classes: [
              ...state.classes,
              {
                id: crypto.randomUUID(),
                name,
                grade,
                letter,
                period,
              },
            ],
          };
        }),
      removeClass: (id) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        })),
      updateClass: (id, cls) =>
        set((state) => ({
          classes: state.classes.map((c) => {
            if (c.id !== id) return c;
            const updated = { ...c, ...cls };
            // Recompute name if grade or letter changes
            updated.name = `${updated.grade} ${updated.letter}`;
            return updated;
          }),
        })),
    }),
    {
      name: "sesi-classes-storage",
    }
  )
);
