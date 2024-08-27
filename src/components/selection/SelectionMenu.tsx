import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import clsx from "clsx";
import { useRoomSetup } from "@/react-contexts/SetupContext";
import { animated, config, useSpring, useTrail } from "@react-spring/web";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface SelectionItemProps {
  id: string;
  name: string;
  imagePath: string;
}

const ColorItem: React.FC<SelectionItemProps> = (props) => {
  const { selections, setSelections } = useRoomSetup();
  const selectedCls =
    "border-2 border-js-red outline-js-red/20 outline transition-all";
  const unselectedCls =
    "border-2 border-transparent cursor-pointer outline group-hover:outline-js-red/20 outline-transparent transition-all";
  const isSelected = selections.color.id === props.id;

  const handleSelect = () => {
    if (isSelected) return;

    setSelections((prev) => ({
      ...prev,
      color: props,
    }));
  };

  return (
    <button
      onClick={handleSelect}
      className={clsx(
        "group relative w-full h-full max-h-[8rem] rounded flex items-center gap-3 px-4 py-2.5 bg-slate-100"
      )}
    >
      <div
        className={clsx(
          "rounded-full",
          isSelected && selectedCls,
          !isSelected && unselectedCls
        )}
        style={{
          WebkitBoxSizing: "border-box",
          MozBoxSizing: "border-box",
          boxSizing: "border-box",
        }}
      >
        <Image
          src={props.imagePath}
          alt={`variation ${props.name} img`}
          width={24}
          height={24}
          className="object-contain border-4 border-slate-200 rounded-full"
        />
      </div>
      <p className="truncate text-xs font-semibold">{props.name}</p>
    </button>
  );
};

const VariationItem: React.FC<SelectionItemProps> = (props) => {
  const { selections, setSelections } = useRoomSetup();
  const selectedCls =
    "border-2 border-js-red outline-js-red/20 outline transition-all";
  const unselectedCls =
    "border-2 border-transparent cursor-pointer outline-js-red/20 hover:outline transition-all";
  const isSelected = selections.variant.id === props.id;

  const handleSelect = () => {
    if (isSelected) return;

    setSelections((prev) => ({
      ...prev,
      variant: props,
    }));
  };

  return (
    <button
      onClick={handleSelect}
      className={clsx(
        "group relative w-full h-full max-h-[8rem] rounded flex flex-col gap-3 px-4 py-2.5 bg-slate-100",
        isSelected && selectedCls,
        !isSelected && unselectedCls
      )}
    >
      <Image
        src={props.imagePath}
        alt={`variation ${props.name} img`}
        width={70}
        height={70}
        className="object-contain mx-auto"
      />
      <p className="truncate text-xs font-semibold">{props.name}</p>
    </button>
  );
};

const AnimatedCard = animated(Card);

const SelectionMenu = () => {
  const { selectionStage, setSelectionStage, variants, colors } =
    useRoomSetup();

  const itemsToAnimate = selectionStage === "variant" ? variants : colors;
  const trailAnimation = useTrail(itemsToAnimate.length, {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: config.stiff,
  });

  const fadeInAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.stiff,
  });

  return (
    <AnimatedCard
      style={fadeInAnimation}
      className="min-w-[16rem] max-w-[16rem] p-4 shadow-sm flex flex-col gap-3"
    >
      <CardHeader className="flex flex-col gap-0.5 p-0">
        <div className="flex gap-2 items-center">
          {selectionStage === "color" && (
            <Button
              variant={"muted"}
              size={"icon"}
              onClick={() => {
                setSelectionStage("variant");
              }}
            >
              <ArrowLeft size={16} />
            </Button>
          )}
          <h1 className="font-semibold text-lg text-js-black leading-none">
            Select {selectionStage}
          </h1>
        </div>
        <p className="text-xs leading-none text-slate-600">
          You can change it anytime
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {selectionStage === "color" && (
          <div className="grid grid-cols-1 gap-2 w-full">
            {itemsToAnimate.map((variant, index) => (
              <animated.div style={trailAnimation[index]} key={variant.id}>
                <ColorItem {...variant} />
              </animated.div>
            ))}
          </div>
        )}
        {selectionStage === "variant" && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {itemsToAnimate.map((variant, index) => (
              <animated.div style={trailAnimation[index]} key={variant.id}>
                <VariationItem {...variant} />
              </animated.div>
            ))}
          </div>
        )}
      </CardContent>
    </AnimatedCard>
  );
};

export default SelectionMenu;
