import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StepHeader } from "./StepHeader";

const GRID_SIZE = 5;
const BOX_SIZE = 140;
const GAP = 24;

export const Scene3_Microservices: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxes = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

  const labels = ["Paiement", "Profils", "Recherche", "Lecture vidéo"];

  return (
    <AbsoluteFill name="Microservices" style={{ backgroundColor: "#141414" }}>
      <StepHeader step="ÉTAPE 2" title="Des centaines de microservices" />

      <div
        style={{
          position: "absolute",
          top: 620,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${BOX_SIZE}px)`,
            gap: GAP,
          }}
        >
          {boxes.map((i) => {
            const delay = 0.9 * fps + i * 3;
            const lit = interpolate(frame, [delay, delay + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            });
            return (
              <Interactive.Div
                key={i}
                name={`Service box ${i}`}
                style={{
                  width: BOX_SIZE,
                  height: BOX_SIZE,
                  borderRadius: 16,
                  backgroundColor: lit > 0.5 ? "#E50914" : "#262626",
                  opacity: interpolate(
                    frame,
                    [delay, delay + 6],
                    [0.3, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  ),
                  scale: interpolate(frame, [delay, delay + 12], [0.85, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 14 }),
                    output: "perceptual-scale",
                  }),
                }}
              />
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1350,
          left: 80,
          right: 80,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {labels.map((label, i) => {
          const delay = 2.4 * fps + i * 0.2 * fps;
          return (
            <Interactive.Div
              key={label}
              name={`Label ${label}`}
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                fontSize: 40,
                color: "#FFFFFF",
                backgroundColor: "#262626",
                border: "2px solid #E50914",
                borderRadius: 999,
                padding: "14px 32px",
                opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: interpolate(
                  frame,
                  [delay, delay + 12],
                  ["0px 16px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              {label}
            </Interactive.Div>
          );
        })}
      </div>

      <Interactive.Div
        name="Subtitle"
        style={{
          position: "absolute",
          top: 1620,
          left: 80,
          right: 80,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 500,
          fontSize: 46,
          color: "#B3B3B3",
          textAlign: "center",
          opacity: interpolate(frame, [3.2 * fps, 3.7 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Chacun fait un seul travail, indépendamment des autres
      </Interactive.Div>
    </AbsoluteFill>
  );
};
