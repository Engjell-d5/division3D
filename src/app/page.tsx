"use client";

import Actions from "@/components/Actions";
import ItemSelector from "@/components/ItemSelector";
import Tutorial from "@/components/tutorial/Tutorial";
import { EcsProvider } from "@/context/EcsContext";
import useTutorial from "@/hooks/useTutorial";

export default function Home() {
  const { showTutorial, onWatchLater } = useTutorial();

  return (
    <EcsProvider>
      <div className="absolute bottom-0 h-auto w-auto">
        <ItemSelector />
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none w-full h-full flex items-end justify-end p-4">
        <Actions />
      </div>

      <Tutorial show={showTutorial} onClose={onWatchLater} />
    </EcsProvider>
  );
}
