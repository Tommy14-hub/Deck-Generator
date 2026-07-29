import { Easing, interpolate } from "remotion";
import type { CSSProperties } from "react";

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** Normalised 0→1 ramp starting at `start`, eased out. */
export const ramp = (
  frame: number,
  start: number,
  duration = 18,
  easing = EASE_OUT,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Linear 0→1 ramp — for progress bars and traveling packets. */
export const linearRamp = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const fadeIn = (
  frame: number,
  start: number,
  duration = 14,
): CSSProperties => ({ opacity: ramp(frame, start, duration) });

/** Fade while rising into place. */
export const fadeUp = (
  frame: number,
  start: number,
  distance = 22,
  duration = 20,
): CSSProperties => {
  const t = ramp(frame, start, duration);

  return {
    opacity: t,
    translate: `0px ${(1 - t) * distance}px`,
  };
};

/** Spring-scaled entrance for icons and badges. */
export const pop = (
  frame: number,
  start: number,
  duration = 22,
): CSSProperties => {
  const t = ramp(frame, start, duration, Easing.spring({ damping: 12 }));

  return {
    opacity: ramp(frame, start, duration * 0.6),
    scale: interpolate(t, [0, 1], [0.72, 1]),
  };
};

/** Fades in, holds, then fades out — for transient callouts. */
export const flash = (
  frame: number,
  start: number,
  hold: number,
  fade = 12,
): number =>
  interpolate(
    frame,
    [start, start + fade, start + fade + hold, start + fade + hold + fade],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

/** Repeating 0→1→0 pulse, for "live traffic" indicators. */
export const pulse = (frame: number, period = 40): number =>
  (Math.sin((frame / period) * Math.PI * 2) + 1) / 2;
