import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudentHistoryEvent {
  id: string;
  type:
    | "created"
    | "archived"
    | "reactivated"
    | "transfer_out"
    | "transfer_in"
    | "class_change"
    | "info_update";
  date: string; // ISO string
  description: string;
}

export interface Student {
  id: string;
  name: string;
  classId?: string;
  status: "active" | "inactive" | "transferred";
  enrollmentType: "regular" | "transfer";
  createdAt: string; // ISO string for sorting by admission
  transferDate?: string; // ISO string
  transferOrigin?: string;
  transferCity?: string;
  transferState?: string;
  transferObservation?: string;
  number?: number;
  history: StudentHistoryEvent[];
}

interface StudentState {
  students: Student[];
  addStudent: (data: {
    name: string;
    classId?: string;
    number?: number;
    enrollmentType?: "regular" | "transfer";
    transferDate?: string;
    transferOrigin?: string;
    transferCity?: string;
    transferState?: string;
    transferObservation?: string;
  }) => void;
  removeStudent: (id: string) => void;
  updateStudent: (
    id: string,
    data: Partial<Omit<Student, "id" | "history">>
  ) => void;
  addHistoryEvent: (
    studentId: string,
    type: StudentHistoryEvent["type"],
    description: string
  ) => void;
  toggleStatus: (
    id: string,
    status: Student["status"],
    reason?: string
  ) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      students: [],
      addStudent: ({
        name,
        classId,
        number,
        enrollmentType = "regular",
        transferDate,
        transferOrigin,
        transferCity,
        transferState,
        transferObservation,
      }) =>
        set((state) => {
          const createdAt = new Date().toISOString();
          const newStudent: Student = {
            id: crypto.randomUUID(),
            name,
            classId,
            status: "active",
            enrollmentType,
            createdAt,
            transferDate,
            transferOrigin,
            transferCity,
            transferState,
            transferObservation,
            number: number || state.students.length + 1,
            history: [
              {
                id: crypto.randomUUID(),
                type: "created",
                date: createdAt,
                description:
                  enrollmentType === "transfer"
                    ? `Estudante transferido de ${
                        transferOrigin || "Outra escola"
                      }${
                        transferCity
                          ? ` (${transferCity}-${transferState})`
                          : ""
                      }.`
                    : "Estudante cadastrado no sistema (Matrícula Regular).",
              },
            ],
          };
          const updatedStudents = [...state.students, newStudent].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          return { students: updatedStudents };
        }),
      // ... (rest of the store remains unchanged)
      removeStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),
      updateStudent: (id, data) =>
        set((state) => ({
          students: state.students
            .map((s) => (s.id === id ? { ...s, ...data } : s))
            .sort((a, b) => a.name.localeCompare(b.name)),
        })),
      addHistoryEvent: (studentId, type, description) =>
        set((state) => ({
          students: state.students.map((s) => {
            if (s.id !== studentId) return s;
            return {
              ...s,
              history: [
                {
                  id: crypto.randomUUID(),
                  type,
                  date: new Date().toISOString(),
                  description,
                },
                ...s.history,
              ],
            };
          }),
        })),
      toggleStatus: (id, status, reason) =>
        set((state) => ({
          // ... (rest of implementation)
          students: state.students.map((s) => {
            if (s.id !== id) return s;

            // Determine event type based on status change
            let eventType: StudentHistoryEvent["type"] = "info_update";
            let description = `Status alterado para ${status}`;

            if (status === "inactive") {
              eventType = "archived";
              description = reason || "Estudante arquivado.";
            } else if (status === "active") {
              eventType = "reactivated";
              description = reason || "Estudante reativado.";
            } else if (status === "transferred") {
              eventType = "transfer_out";
              description = reason || "Estudante transferido.";
            }

            const newEvent: StudentHistoryEvent = {
              id: crypto.randomUUID(),
              type: eventType,
              date: new Date().toISOString(),
              description,
            };

            return {
              ...s,
              status: status,
              history: [newEvent, ...s.history],
            };
          }),
        })),
    }),
    {
      name: "sesi-students-storage",
    }
  )
);
