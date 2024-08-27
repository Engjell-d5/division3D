import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRoomSetup } from "@/react-contexts/SetupContext";
import Image from "next/image";
import { animated, useSpring } from "@react-spring/web";
import { useRouter } from "next/navigation";

interface ControlProps {
  name: string;
  imagePath?: string;
}

const Label: React.FC<ControlProps> = (props) => {
  const slideIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: true,
  });

  return (
    <animated.div
      style={slideIn}
      className="px-2 py-1 bg-slate-100 flex items-center gap-1"
    >
      {props.imagePath && (
        <Image
          src={props.imagePath}
          alt={`${props.name} img`}
          width={16}
          height={16}
          className="rounded-full"
        />
      )}
      <span className="text-lg font-bold leading-none">{props.name}</span>
    </animated.div>
  );
};

const CenterMenu: React.FC = () => {
  const { selectionStage, selections, setSelectionStage } = useRoomSetup();
  const { push } = useRouter();

  return (
    <div className="bg-white overflow-hidden w-full px-2.5 py-2 flex items-center justify-between rounded">
      {selectionStage === "variant" && (
        <>
          <Label name={selections.variant.name} />
          <Button
            size="sm"
            onClick={() => {
              setSelectionStage("color");
            }}
          >
            Select
          </Button>
        </>
      )}
      {selectionStage === "color" && (
        <>
          <Label
            name={selections.color.name}
            imagePath={selections.color.imagePath}
          />
          <Button
            size="sm"
            onClick={() => {
              const confirmed = confirm("Done, do you want to proceed?");
              if (confirmed) {
                push("/");
              }
            }}
          >
            Select
          </Button>
        </>
      )}
    </div>
  );
};

const MiniSelectionMenu: React.FC = () => {
  const { next, prev } = useRoomSetup();

  const slideIn = useSpring({
    from: { opacity: 0, transform: "translateY(100%)" },
    to: { opacity: 1, transform: "translateY(0%)" },
  });

  return (
    <animated.section
      style={slideIn}
      className="flex items-center justify-between gap-2.5 w-full min-w-[19rem] max-w-[19rem]"
    >
      <Button
        onClick={prev}
        variant={"secondary"}
        size={"icon"}
        className="flex-shrink-0"
      >
        <ArrowLeft size={20} className="text-slate-800" />
      </Button>
      <CenterMenu />
      <Button
        onClick={next}
        variant={"secondary"}
        size={"icon"}
        className="flex-shrink-0"
      >
        <ArrowRight size={20} className="text-slate-800" />
      </Button>
    </animated.section>
  );
};

export default MiniSelectionMenu;
