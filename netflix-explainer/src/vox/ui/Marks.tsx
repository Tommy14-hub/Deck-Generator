import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import { C } from "../theme";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

const draw = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

type HighlightProps = {
  readonly children: React.ReactNode;
  readonly start?: number;
  readonly duration?: number;
  readonly color?: string;
  readonly style?: CSSProperties;
};

/**
 * The signature marker swipe: a slightly skewed block of colour that wipes in
 * behind the words. Sits behind the text so the ink stays fully legible.
 */
export const Highlight: React.FC<HighlightProps> = ({
  children,
  start = 0,
  duration = 14,
  color = C.yellow,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span
        style={{
          position: "absolute",
          left: "-0.14em",
          right: "-0.14em",
          top: "0.10em",
          bottom: "0.02em",
          backgroundColor: color,
          transformOrigin: "left center",
          scale: `${draw(frame, start, duration)} 1`,
          rotate: "-0.7deg",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
};

type MarkProps = {
  readonly start?: number;
  readonly duration?: number;
  readonly color?: string;
  readonly width?: number;
  readonly style?: CSSProperties;
};

/**
 * Hand-drawn circling annotation. The path deliberately overshoots its start
 * so it reads as drawn by hand rather than geometrically constructed.
 */
export const CircleMark: React.FC<MarkProps> = ({
  start = 0,
  duration = 26,
  color = C.red,
  width = 7,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = draw(frame, start, duration);

  return (
    <svg
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}
      viewBox="0 0 100 100"
    >
      <path
        d="M8 50C8 22 38 7 59 9C85 11 95 29 94 50C93 73 70 93 48 90C23 87 6 73 8 49C9 31 19 17 41 11"
        fill="none"
        pathLength={1}
        stroke={color}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        strokeLinecap="round"
        strokeWidth={width}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

/** Wobbly underline, drawn left to right. */
export const UnderlineMark: React.FC<MarkProps> = ({
  start = 0,
  duration = 18,
  color = C.red,
  width = 6,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = draw(frame, start, duration);

  return (
    <svg
      preserveAspectRatio="none"
      style={{ position: "absolute", overflow: "visible", ...style }}
      viewBox="0 0 100 12"
    >
      <path
        d="M1 8C18 3 34 10 52 5C68 1 84 8 99 4"
        fill="none"
        pathLength={1}
        stroke={color}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        strokeLinecap="round"
        strokeWidth={width}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

type ArrowProps = MarkProps & {
  /** Mirrors the curve so the arrow can point from either side. */
  readonly flip?: boolean;
};

/** Curved pointer with a head that lands just after the shaft finishes. */
export const ArrowMark: React.FC<ArrowProps> = ({
  start = 0,
  duration = 22,
  color = C.red,
  width = 6,
  flip = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const shaft = draw(frame, start, duration);
  const head = draw(frame, start + duration * 0.75, duration * 0.4);

  return (
    <svg
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        overflow: "visible",
        scale: flip ? "-1 1" : undefined,
        ...style,
      }}
      viewBox="0 0 100 100"
    >
      <path
        d="M4 8C34 6 68 22 84 66"
        fill="none"
        pathLength={1}
        stroke={color}
        strokeDasharray={1}
        strokeDashoffset={1 - shaft}
        strokeLinecap="round"
        strokeWidth={width}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M66 56L84 68L88 46"
        fill="none"
        pathLength={1}
        stroke={color}
        strokeDasharray={1}
        strokeDashoffset={1 - head}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={width}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
