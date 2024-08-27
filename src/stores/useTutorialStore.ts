import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TutorialStoreState {
  hasSeenTutorial: boolean;
  setHasSeenTutorial: (hasSeenTutorial: boolean) => void;
}

const useTutorialStore = create<TutorialStoreState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      setHasSeenTutorial: (hasSeenTutorial: boolean) =>
        set({ hasSeenTutorial }),
    }),
    {
      name: "tutorial-store",
    }
  )
);

export default useTutorialStore;
