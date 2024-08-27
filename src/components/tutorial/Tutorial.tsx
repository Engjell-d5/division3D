import { animated, useSpring } from "@react-spring/web";
import NoiseOverlay from "../NoiseOverylay";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

interface TutorialProps {
  show: boolean;
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = (props) => {
  const { show, onClose } = props;

  const fadeInOutSpring = useSpring({
    from: { opacity: 0, pointerEvents: "none" as string },
    to: {
      opacity: show ? 1 : 0,
      pointerEvents: show ? "auto" : "none",
    },
  });

  return (
    <animated.div
      style={
        fadeInOutSpring as unknown as {
          opacity: number;
          pointerEvents: "auto" | "none";
        }
      }
    >
      <NoiseOverlay className="flex items-center justify-center px-4 after:opacity-80">
        <Card className="w-full max-w-[600px] overflow-hidden border-none">
          <CardContent className="bg-gray-200 aspect-video flex items-center justify-center p-0">
            Insert video here
          </CardContent>
          <CardFooter className="px-4 py-4 flex items-center justify-end">
            <Button onClick={onClose} variant={"outline"}>
              Watch Later
            </Button>
          </CardFooter>
        </Card>
      </NoiseOverlay>
    </animated.div>
  );
};

export default Tutorial;
