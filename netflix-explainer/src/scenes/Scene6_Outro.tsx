import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Scene6_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Outro"
      style={{
        backgroundColor: "#141414",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}
    >
      <Interactive.Div
        name="Stat number"
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 160,
          color: "#E50914",
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(
            frame,
            [0, 0.4 * fps, 0.7 * fps],
            [0.7, 1.1, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 10 }),
              output: "perceptual-scale",
            },
          ),
        }}
      >
        &lt; 100 ms
      </Interactive.Div>

      <Interactive.Div
        name="Stat label"
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 600,
          fontSize: 52,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 900,
          opacity: interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        pour lancer ton film, partout dans le monde
      </Interactive.Div>

      <Interactive.Div
        name="CTA button"
        style={{
          marginTop: 60,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 700,
          fontSize: 46,
          color: "#FFFFFF",
          backgroundColor: "#E50914",
          borderRadius: 999,
          padding: "24px 56px",
          opacity: interpolate(frame, [2 * fps, 2.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [2 * fps, 2.6 * fps],
            ["0px 24px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        Abonne-toi pour la suite 🔥
      </Interactive.Div>

      <Interactive.Div
        name="Netflix wordmark small"
        style={{
          position: "absolute",
          bottom: 100,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 2,
          color: "#B3B3B3",
          opacity: interpolate(frame, [3 * fps, 3.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        NETFLIX · comment ça marche
      </Interactive.Div>
    </AbsoluteFill>
  );
};
