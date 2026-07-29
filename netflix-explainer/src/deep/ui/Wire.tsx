import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, MONO } from "../theme";
import { ramp } from "./anim";

type Direction = "down" | "up" | "right" | "left";

type Props = {
  readonly direction?: Direction;
  readonly length: number;
  readonly thickness?: number;
  readonly color?: string;
  readonly start?: number;
  readonly drawDuration?: number;
  readonly packets?: number;
  /** Packet travel speed, in pixels per second. */
  readonly speed?: number;
  readonly label?: string;
};

/**
 * A link between two infrastructure nodes: the line draws itself in, then
 * packets stream along it to show direction and sustained throughput.
 */
export const Wire: React.FC<Props> = ({
  direction = "down",
  length,
  thickness = 3,
  color = COLORS.cyan,
  start = 0,
  drawDuration = 18,
  packets = 3,
  speed = 150,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vertical = direction === "down" || direction === "up";
  const forward = direction === "down" || direction === "right";
  const drawn = ramp(frame, start, drawDuration);
  const packetOpacity = ramp(frame, start + drawDuration - 4, 10);

  const origin = {
    down: "top center",
    up: "bottom center",
    right: "left center",
    left: "right center",
  }[direction];

  const travelled = ((frame - start - drawDuration) * speed) / fps / length;
  const dot = 11;

  return (
    <div
      style={{
        position: "relative",
        width: vertical ? thickness : length,
        height: vertical ? length : thickness,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: thickness,
          backgroundColor: "rgba(255,255,255,0.09)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: thickness,
          backgroundColor: `${color}70`,
          transformOrigin: origin,
          scale: vertical ? `1 ${drawn}` : `${drawn} 1`,
        }}
      />

      {Array.from({ length: packets }, (_, i) => {
        const u = (((travelled + i / packets) % 1) + 1) % 1;
        const pos = (forward ? u : 1 - u) * length;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: dot,
              height: dot,
              borderRadius: dot,
              backgroundColor: color,
              boxShadow: `0 0 14px ${color}`,
              opacity: packetOpacity * (1 - Math.abs(u - 0.5) * 0.5),
              top: vertical ? pos - dot / 2 : thickness / 2 - dot / 2,
              left: vertical ? thickness / 2 - dot / 2 : pos - dot / 2,
            }}
          />
        );
      })}

      {label ? (
        <div
          style={{
            position: "absolute",
            fontFamily: MONO,
            fontSize: 20,
            color: `${color}DD`,
            whiteSpace: "nowrap",
            opacity: packetOpacity,
            ...(vertical
              ? { left: thickness + 18, top: length / 2 - 14 }
              : { top: -34, left: length / 2, translate: "-50% 0" }),
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
