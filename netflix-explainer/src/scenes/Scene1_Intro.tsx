import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Scene1_Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Intro"
      style={{
        backgroundColor: "#141414",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
      }}
    >
      <Interactive.Div
        name="Netflix wordmark"
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 150,
          letterSpacing: 4,
          color: "#E50914",
          scale: interpolate(frame, [0, 0.6 * fps], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        NETFLIX
      </Interactive.Div>
      <Interactive.Div
        name="Intro subtitle"
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 600,
          fontSize: 52,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 880,
          opacity: interpolate(frame, [0.9 * fps, 1.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [0.9 * fps, 1.4 * fps],
            ["0px 20px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        Comment ça marche, vraiment ?
      </Interactive.Div>
    </AbsoluteFill>
  );
};
