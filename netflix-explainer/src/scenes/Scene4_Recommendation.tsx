import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StepHeader } from "./StepHeader";

const SIGNALS: { emoji: string; fromX: number; fromY: number }[] = [
  { emoji: "👍", fromX: -320, fromY: -60 },
  { emoji: "▶️", fromX: 320, fromY: -60 },
  { emoji: "⭐", fromX: -320, fromY: 160 },
  { emoji: "⏱️", fromX: 320, fromY: 160 },
];

const THUMB_COLORS = ["#E50914", "#B3B3B3", "#831010", "#FFFFFF"];

export const Scene4_Recommendation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill name="Recommandation" style={{ backgroundColor: "#141414" }}>
      <StepHeader step="ÉTAPE 3" title="L'algorithme choisit pour toi" />

      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          height: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {SIGNALS.map((signal, i) => {
          const delay = 0.8 * fps + i * 0.15 * fps;
          const progress = interpolate(frame, [delay, delay + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          });
          return (
            <Interactive.Div
              key={signal.emoji}
              name={`Signal ${signal.emoji}`}
              style={{
                position: "absolute",
                fontSize: 72,
                opacity: interpolate(
                  frame,
                  [delay, delay + 10, delay + 20],
                  [0, 1, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                ),
                translate: `${signal.fromX * (1 - progress)}px ${
                  signal.fromY * (1 - progress)
                }px`,
              }}
            >
              {signal.emoji}
            </Interactive.Div>
          );
        })}

        <Interactive.Div
          name="Brain icon"
          style={{
            fontSize: 150,
            scale: interpolate(
              frame,
              [1.4 * fps, 1.6 * fps, 1.8 * fps],
              [1, 1.25, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                output: "perceptual-scale",
              },
            ),
          }}
        >
          🧠
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {THUMB_COLORS.map((color, i) => {
          const delay = 2.2 * fps + i * 0.12 * fps;
          return (
            <Interactive.Div
              key={color + i}
              name={`Thumbnail ${i}`}
              style={{
                width: 200,
                height: 280,
                borderRadius: 12,
                backgroundColor: color,
                opacity: interpolate(frame, [delay, delay + 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: interpolate(
                  frame,
                  [delay, delay + 14],
                  ["0px 60px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 14 }),
                  },
                ),
              }}
            />
          );
        })}
      </div>

      <Interactive.Div
        name="Subtitle"
        style={{
          position: "absolute",
          top: 1560,
          left: 80,
          right: 80,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 500,
          fontSize: 46,
          color: "#B3B3B3",
          textAlign: "center",
          opacity: interpolate(frame, [3 * fps, 3.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Basé sur ce que regardent 260 millions de foyers
      </Interactive.Div>
    </AbsoluteFill>
  );
};
