import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StepHeader } from "./StepHeader";

const NODE_COUNT = 5;
const NEAREST_INDEX = 2;

export const Scene5_CDN: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = interpolate(
    frame,
    [2.6 * fps, 3.1 * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  );

  return (
    <AbsoluteFill name="Open Connect" style={{ backgroundColor: "#141414" }}>
      <StepHeader step="ÉTAPE 4" title="Open Connect, le CDN Netflix" />

      <div
        style={{
          position: "absolute",
          top: 720,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {Array.from({ length: NODE_COUNT }, (_, i) => i).map((i) => {
          const delay = 0.9 * fps + i * 6;
          const isNearest = i === NEAREST_INDEX;
          return (
            <Interactive.Div
              key={i}
              name={`Server node ${i}`}
              style={{
                fontSize: isNearest ? 110 : 80,
                opacity: interpolate(frame, [delay, delay + 15], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                scale: isNearest
                  ? interpolate(
                      frame,
                      [2.2 * fps, 2.5 * fps, 2.8 * fps],
                      [1, 1.25, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.4, 0, 0.2, 1),
                        output: "perceptual-scale",
                      },
                    )
                  : 1,
              }}
            >
              🖥️
            </Interactive.Div>
          );
        })}
      </div>

      <Interactive.Div
        name="Connection line"
        style={{
          position: "absolute",
          top: 900,
          left: 526,
          width: 8,
          height: 280,
          borderRadius: 8,
          backgroundColor: "#333333",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${lineProgress * 100}%`,
            backgroundColor: "#E50914",
            borderRadius: 8,
          }}
        />
      </Interactive.Div>

      <Interactive.Div
        name="Phone emoji"
        style={{
          position: "absolute",
          top: 1180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 130,
          opacity: interpolate(frame, [3.1 * fps, 3.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [3.1 * fps, 3.5 * fps], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
        }}
      >
        📱
      </Interactive.Div>

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
          opacity: interpolate(frame, [3.7 * fps, 4.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        La vidéo est déjà stockée près de chez toi : zéro lag
      </Interactive.Div>
    </AbsoluteFill>
  );
};
