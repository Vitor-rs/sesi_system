import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Student {
  id: string;
  name: string;
  active: boolean;
}

interface StudentState {
  students: Student[];
  addStudent: (name: string) => void;
  updateStudent: (id: string, name: string) => void;
  removeStudent: (id: string) => void;
  setStudents: (students: Student[]) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      students: [],
      addStudent: (name) =>
        set((state) => ({
          students: [
            ...state.students,
            {
              id: crypto.randomUUID(),
              name,
              active: true,
            },
          ].sort((a, b) => a.name.localeCompare(b.name)),
        })),
      updateStudent: (id, name) =>
        set((state) => ({
          students: state.students
            .map((student) =>
              student.id === id ? { ...student, name } : student
            )
            .sort((a, b) => a.name.localeCompare(b.name)),
        })),
      removeStudent: (id) =>
        set((state) => ({
          students: state.students.filter((student) => student.id !== id),
        })),
      setStudents: (students) =>
        set({
          students: students.sort((a, b) => a.name.localeCompare(b.name)),
        }),
    }),
    {
      name: "sesi-system-students",
    }
  )
);
