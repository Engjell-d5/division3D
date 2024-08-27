import React, {
  type ReactElement,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useState } from "react";

const FIXED_VARIANTS = [
  {
    id: "1",
    name: "One",
    imagePath: "/images/placeholders/variation-placeholder.jpg",
  },
  {
    id: "2",
    name: "Two",
    imagePath: "/images/placeholders/variation-placeholder.jpg",
  },
  {
    id: "3",
    name: "Three",
    imagePath: "/images/placeholders/variation-placeholder.jpg",
  },
  {
    id: "4",
    name: "Four",
    imagePath: "/images/placeholders/variation-placeholder.jpg",
  },
];

const FIXED_COLORS = [
  {
    id: "1",
    name: "Red",
    imagePath: "/images/placeholders/red-color-placeholder.jpg",
  },
  {
    id: "2",
    name: "Natural",
    imagePath: "/images/placeholders/natural-color-placeholder.jpg",
  },
  {
    id: "3",
    name: "Dark",
    imagePath: "/images/placeholders/dark-color-placeholder.jpg",
  },
];

interface RoomSetupContextState {
  selections: {
    variant: (typeof FIXED_VARIANTS)[0];
    color: (typeof FIXED_COLORS)[0];
  };
  setSelections: Dispatch<
    SetStateAction<{
      variant: (typeof FIXED_VARIANTS)[0];
      color: (typeof FIXED_COLORS)[0];
    }>
  >;
  selectionStage: "variant" | "color";
  setSelectionStage: (stage: "variant" | "color") => void;
  variants: typeof FIXED_VARIANTS;
  colors: typeof FIXED_COLORS;
  next: () => void;
  prev: () => void;
}

const RoomSetupContext = React.createContext<RoomSetupContextState>({
  selections: {
    variant: FIXED_VARIANTS[0],
    color: FIXED_COLORS[0],
  },
  setSelections: () => {},
  selectionStage: "variant",
  setSelectionStage: () => {},
  variants: FIXED_VARIANTS,
  colors: FIXED_COLORS,
  next: () => {},
  prev: () => {},
});

interface ProviderProps {
  children: ReactElement;
}

export const RoomSetupProvider = (props: ProviderProps) => {
  const { children } = props;
  const [selections, setSelections] = useState({
    variant: FIXED_VARIANTS[0],
    color: FIXED_COLORS[0],
  });
  const [selectionStage, setSelectionStage] = useState<"variant" | "color">(
    "variant"
  );

  const handleNextSelection = () => {
    const list = selectionStage === "variant" ? FIXED_VARIANTS : FIXED_COLORS;
    const currentIndex = list.findIndex(
      (item) => item.id === selections[selectionStage].id
    );
    const nextIndex = currentIndex + 1 > list.length - 1 ? 0 : currentIndex + 1;
    const nextItem = list[nextIndex];
    setSelections((prev) => ({
      ...prev,
      [selectionStage]: nextItem,
    }));
  };

  const handlePrevSelection = () => {
    const list = selectionStage === "variant" ? FIXED_VARIANTS : FIXED_COLORS;
    const currentIndex = list.findIndex(
      (item) => item.id === selections[selectionStage].id
    );
    const prevIndex = currentIndex - 1 < 0 ? list.length - 1 : currentIndex - 1;
    const prevItem = list[prevIndex];
    setSelections((prev) => ({
      ...prev,
      [selectionStage]: prevItem,
    }));
  };

  return (
    <RoomSetupContext.Provider
      value={{
        selections,
        setSelections,
        selectionStage,
        setSelectionStage,
        variants: FIXED_VARIANTS,
        colors: FIXED_COLORS,
        next: handleNextSelection,
        prev: handlePrevSelection,
      }}
    >
      {children}
    </RoomSetupContext.Provider>
  );
};

export const useRoomSetup = () => {
  const contextState = useContext(RoomSetupContext);

  if (!contextState) {
    throw new Error("useRoomSetup must be used within a RoomSetupProvider");
  }

  return contextState;
};
