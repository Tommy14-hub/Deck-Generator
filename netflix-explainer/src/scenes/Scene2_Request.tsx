import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StepHeader } from "./StepHeader";

export const Scene2_Request: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dotProgress = interpolate(
    frame,
    [1.6 * fps, 2.2 * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  );

  return (
    <AbsoluteFill name="La demande" style={{ backgroundColor: "#141414" }}>
      <StepHeader step="ÉTAPE 1" title="Tu appuies sur play" />

      <AbsoluteFill
        name="Flow"
        style={{
          top: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        <Interactive.Div
          name="Phone emoji"
          style={{
            fontSize: 160,
            opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [0, 0.5 * fps], [0.6, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 10 }),
              output: "perceptual-scale",
            }),
          }}
        >
          📱
        </Interactive.Div>

        <Interactive.Div
          name="Arrow track"
          style={{
            width: 8,
            height: 220,
            borderRadius: 8,
            backgroundColor: "#333333",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${dotProgress * 100}%`,
              backgroundColor: "#E50914",
              borderRadius: 8,
            }}
          />
        </Interactive.Div>

        <Interactive.Div
          name="Cloud icon"
          style={{
            fontSize: 160,
            opacity: interpolate(frame, [1.8 * fps, 2.4 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [1.8 * fps, 2.4 * fps], [0.6, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 10 }),
              output: "perceptual-scale",
            }),
          }}
        >
          ☁️
        </Interactive.Div>

        <Interactive.Div
          name="Subtitle"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 500,
            fontSize: 46,
            color: "#B3B3B3",
            textAlign: "center",
            maxWidth: 860,
            opacity: interpolate(frame, [2.6 * fps, 3.1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Ta requête part vers les serveurs Netflix, hébergés chez AWS
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
