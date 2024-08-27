"use client";

import MiniSelectionMenu from "@/components/selection/MiniSelectionMenu";
import SelectionMenu from "@/components/selection/SelectionMenu";
import { RoomSetupProvider, useRoomSetup } from "@/react-contexts/SetupContext";

const DeleteMeLater = () => {
  const { selections, variants, colors } = useRoomSetup();

  const VARIANT_NAME_TO_COLOR = {
    [variants[0].name]: "blue",
    [variants[1].name]: "green",
    [variants[2].name]: "red",
    [variants[3].name]: "yellow",
  };

  const COLOR_NAME_TO_COLOR = {
    [colors[0].name]: "pink",
    [colors[1].name]: "cyan",
    [colors[2].name]: "orange",
  };

  return (
    <div
      className="transition-all absolute flex items-center justify-center inset-0 w-full h-full z-0"
      style={{
        background: `linear-gradient(120deg, ${
          COLOR_NAME_TO_COLOR[selections.color.name]
        } 0%, ${VARIANT_NAME_TO_COLOR[selections.variant.name]} 100%)`,
      }}
      role="presentation"
    >
      <span className="text-white text-center font-semibold tracking-widest mix-blend-soft-light">
        PLACEHOLDER <br /> WHILE ROOM IS BEING DEVELOPED
      </span>
    </div>
  );
};

const OverlayUi = () => {
  const { selectionStage } = useRoomSetup();

  return (
    <main className="w-screen h-screen bg-blue-300">
      <div className="hidden lg:block absolute top-5 left-6 z-10">
        <SelectionMenu key={selectionStage} />
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <MiniSelectionMenu />
      </div>
      <DeleteMeLater />
    </main>
  );
};

export default function Setup() {
  return (
    <RoomSetupProvider>
      <OverlayUi />
    </RoomSetupProvider>
  );
}
