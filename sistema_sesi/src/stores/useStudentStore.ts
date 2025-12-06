import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Student {
  id: string;
  name: string;
  classId?: string;
  status: "active" | "inactive" | "transferred";
  number?: number;
}

interface StudentState {
  students: Student[];
  addStudent: (name: string, classId?: string, number?: number) => void;
  removeStudent: (id: string) => void;
  updateStudent: (id: string, data: Partial<Omit<Student, "id">>) => void;
  toggleStatus: (id: string, status: Student["status"]) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      students: [],
      addStudent: (name, classId, number) =>
        set((state) => {
          const newStudent: Student = {
            id: crypto.randomUUID(),
            name,
            classId,
            status: "active",
            number: number || state.students.length + 1, // Auto-increment fallback
          };
          const updatedStudents = [...state.students, newStudent].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          return { students: updatedStudents };
        }),
      removeStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),
      updateStudent: (id, data) =>
        set((state) => ({
          students: state.students
            .map((s) => (s.id === id ? { ...s, ...data } : s))
            .sort((a, b) => a.name.localeCompare(b.name)), // Maintain sort order
        })),
      toggleStatus: (id, status) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, status: status } : s
          ),
        })),
    }),
    {
      name: "sesi-students-storage",
    }
  )
);
