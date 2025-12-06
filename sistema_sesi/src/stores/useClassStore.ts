import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Class {
  id: string;
  name: string;
  year: number;
  shift: "matutino" | "vespertino" | "noturno";
}

interface ClassState {
  classes: Class[];
  addClass: (cls: Omit<Class, "id">) => void;
  removeClass: (id: string) => void;
  updateClass: (id: string, cls: Partial<Omit<Class, "id">>) => void;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set) => ({
      classes: [],
      addClass: (cls) =>
        set((state) => ({
          classes: [...state.classes, { ...cls, id: crypto.randomUUID() }],
        })),
      removeClass: (id) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        })),
      updateClass: (id, cls) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id ? { ...c, ...cls } : c
          ),
        })),
    }),
    {
      name: "sesi-classes-storage",
    }
  )
);
