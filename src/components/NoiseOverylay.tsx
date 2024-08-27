import clsx from "clsx";

interface NoiseOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const NoiseOverlay: React.FC<NoiseOverlayProps> = (props) => {
  const { children, className } = props;

  return (
    <div
      className={clsx(
        `fixed overflow-hidden inset-0 w-full h-full z-50
          after:bg-[url("/images/noise-bg.jpg")] after:-z-10 after:absolute after:inset-0 after:bg-center after:bg-cover after:w-full after:h-full after:content-[""]
        `,
        className
      )}
      style={
        {
          // backgroundImage: "url(/images/noise-bg.jpg)",
          // Q: how to change a backgroundImage opacity
          // A:
        }
      }
    >
      {children}
    </div>
  );
};

export default NoiseOverlay;
