import useTutorialStore from "@/stores/useTutorialStore";
import { useState } from "react";

const useTutorial = () => {
  const { hasSeenTutorial, setHasSeenTutorial } = useTutorialStore();
  const [showTutorial, setShowTutorial] = useState(!hasSeenTutorial);

  const onWatchLater = () => {
    setShowTutorial(false);
    setHasSeenTutorial(true);
  };

  return {
    showTutorial,
    setShowTutorial,
    onWatchLater,
  };
};

export default useTutorial;
