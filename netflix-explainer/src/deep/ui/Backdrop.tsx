import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

type Props = {
  readonly children?: React.ReactNode;
  /** Tints the ambient glow behind the content. */
  readonly glow?: string;
};

/**
 * Shared stage: near-black canvas, slowly drifting blueprint grid, and a soft
 * radial glow that keeps the centre of the frame from going flat.
 */
export const Backdrop: React.FC<Props> = ({ children, glow = COLORS.uv }) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.35) % 60;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage:
            "radial-gradient(ellipse 90% 60% at 50% 45%, black 20%, transparent 80%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 42%, ${glow}22 0%, transparent 70%)`,
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      {children}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 45%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
