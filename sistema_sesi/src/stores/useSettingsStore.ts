import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  schoolYearStart: string; // ISO Date String
  schoolYearEnd: string; // ISO Date String
  setSchoolYear: (start: string, end: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Mock Default: Starts Feb 3rd, 2025
      schoolYearStart: "2025-02-03T00:00:00.000Z",
      schoolYearEnd: "2025-12-19T00:00:00.000Z",

      setSchoolYear: (start, end) =>
        set({ schoolYearStart: start, schoolYearEnd: end }),
    }),
    {
      name: "sesi-settings-storage",
    }
  )
);
