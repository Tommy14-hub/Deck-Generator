import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { UV } from "../design/theme";

export type DataFlowProps = {
  /** SVG path in the local coordinate space of `width` x `height`. */
  readonly d: string;
  readonly width: number;
  readonly height: number;
  readonly color?: string;
  readonly thickness?: number;
  /** Packet travel speed, px per frame. This is the whole point of the film:
   *  PCIe and NVLink use the same component and differ only here. */
  readonly speed?: number;
  /** Dash pattern: [packet, gap]. Longer gaps read as sparser traffic. */
  readonly dash?: readonly [number, number];
  /** Frame at which the pipe draws itself in. */
  readonly start?: number;
  readonly drawDuration?: number;
  readonly reverse?: boolean;
  /** Static pipe drawn under the moving packets. */
  readonly rail?: boolean;
  readonly glow?: boolean;
  readonly style?: CSSProperties;
};

/**
 * A link with traffic on it.
 *
 * The pipe draws in once via strokeDashoffset, then a second stroke with a
 * repeating dash pattern slides along it at `speed` to become the packets.
 * Both PCIe (64 GB/s) and NVLink (900 GB/s) mount this component; only `speed`
 * changes, which is what makes the ~10x contrast legible rather than asserted.
 */
export const DataFlow: React.FC<DataFlowProps> = ({
  d,
  width,
  height,
  color = UV.primary,
  thickness = 6,
  speed = 4,
  dash = [16, 22],
  start = 0,
  drawDuration = 26,
  reverse = false,
  rail = true,
  glow = true,
  style,
}) => {
  const frame = useCurrentFrame();

  const drawn = interpolate(frame, [start, start + drawDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const traffic = interpolate(frame, [start + drawDuration - 6, start + drawDuration + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const travel = (frame - start - drawDuration) * speed * (reverse ? 1 : -1);
  const period = dash[0] + dash[1];

  return (
    <svg
      fill="none"
      height={height}
      style={{ overflow: "visible", ...style }}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      {rail ? (
        <path
          d={d}
          pathLength={1}
          stroke={UV.bgStrong}
          strokeDasharray={1}
          strokeDashoffset={1 - drawn}
          strokeLinecap="round"
          strokeWidth={thickness}
        />
      ) : null}

      {glow ? (
        <path
          d={d}
          opacity={traffic * 0.25}
          stroke={color}
          strokeDasharray={`${dash[0]} ${dash[1]}`}
          strokeDashoffset={travel % period}
          strokeLinecap="round"
          strokeWidth={thickness * 2.6}
        />
      ) : null}

      <path
        d={d}
        opacity={traffic}
        stroke={color}
        strokeDasharray={`${dash[0]} ${dash[1]}`}
        strokeDashoffset={travel % period}
        strokeLinecap="round"
        strokeWidth={thickness}
      />
    </svg>
  );
};

/**
 * Straight vertical or horizontal link — the common case, so callers don't
 * hand-write a path string for every connection.
 */
export const StraightFlow: React.FC<
  Omit<DataFlowProps, "d" | "width" | "height"> & {
    readonly length: number;
    readonly axis?: "x" | "y";
  }
> = ({ length, axis = "y", thickness = 6, ...rest }) => {
  const pad = thickness * 2;
  const vertical = axis === "y";

  return (
    <DataFlow
      d={vertical ? `M${pad} ${pad} L${pad} ${length - pad}` : `M${pad} ${pad} L${length - pad} ${pad}`}
      height={vertical ? length : pad * 2}
      thickness={thickness}
      width={vertical ? pad * 2 : length}
      {...rest}
    />
  );
};
