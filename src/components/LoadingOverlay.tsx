import { Controller, animated } from "@react-spring/web";
import React from "react";
import NoiseOverlay from "./NoiseOverylay";

interface LoadingOverlayProps {
  show: boolean;
}

const PillLabel: React.FC<{ text: string }> = (props) => {
  const { text } = props;

  return (
    <span className="px-3 py-2 bg-white bg-opacity-10 animate-pulse rounded justify-center items-center gap-2.5 inline-flex">
      <div className="text-white text-xl font-semibold leading-tight tracking-widest">
        {text}
      </div>
    </span>
  );
};

const LoadingBar: React.FC<{ progress: number }> = (props) => {
  const { progress } = props;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="text-white text-[64px] font-semibold leading-[64px]">
        {Math.round(progress * 100)}%
      </div>
      <div className="relative w-[200px] h-2 bg-transparent border border-white p-1 rounded">
        <div
          className="absolute top-0 left-0 h-full bg-[#D62125] rounded"
          style={{ width: `${progress * 100}%` }}
        >
          <div className="absolute blur-md top-0 w-full left-0 h-full bg-[#D62125] rounded" />
        </div>
      </div>
    </div>
  );
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = (props) => {
  const [isDoneFading, setIsDoneFading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const fadeOutController = new Controller({
    from: { opacity: 1 },
  });

  React.useEffect(() => {
    if (progress < 1) return;

    fadeOutController.start({
      opacity: 0,
      onRest: () => setIsDoneFading(true),
    });

    return () => {
      fadeOutController.stop();
    };
  }, [progress]);

  React.useEffect(() => {
    if (!!props.show) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + 0.1 > 1) {
          // clearInterval(interval);
          return 1;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [props.show]);

  if (isDoneFading) return null;

  return (
    <animated.div
      style={{
        ...fadeOutController.springs,
      }}
    >
      <NoiseOverlay className="gap-2 flex items-center justify-center flex-col">
        <PillLabel text="Loading" />
        <LoadingBar progress={progress} />
      </NoiseOverlay>
    </animated.div>
  );
};

export default LoadingOverlay;
