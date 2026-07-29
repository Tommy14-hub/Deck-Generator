import { loadFont } from "@remotion/fonts";
import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const DISPLAY = "Archivo Black";
export const SANS = "Inter";
export const MONO = "JetBrains Mono";

loadFont({ family: DISPLAY, url: staticFile("fonts/ArchivoBlack.woff2"), weight: "400" });
loadFont({ family: SANS, url: staticFile("fonts/Inter.woff2"), weight: "100 900" });
loadFont({ family: MONO, url: staticFile("fonts/JetBrainsMono.woff2"), weight: "100 800" });

export const C = {
  bg: "#0A0A0C",
  panel: "rgba(255,255,255,0.045)",
  line: "rgba(255,255,255,0.12)",
  ink: "#F4F4F6",
  dim: "#8C8C97",
  red: "#E50914",
  cyan: "#3DD6FF",
  amber: "#FFB020",
  green: "#3DDC97",
  violet: "#A78BFA",
} as const;

export const M = 76;
/** Everything lands on a half-second grid — that regularity is what reads as pace. */
export const BEAT = 15;

/**
 * Stiff spring with overshoot. Slow eases are what made the previous cut feel
 * sleepy; every entrance here snaps and slightly overshoots instead.
 */
export const snap = (
  frame: number,
  fps: number,
  at: number,
  config?: Partial<{ damping: number; stiffness: number; mass: number }>,
) =>
  spring({
    frame: frame - at,
    fps,
    config: { damping: 13, stiffness: 260, mass: 0.42, ...config },
  });

export const useSnap = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return snap(frame, fps, at);
};

/** Dark technical stage: fast-drifting grid, scanning accent glow. */
export const Stage: React.FC<{
  readonly children: React.ReactNode;
  readonly glow?: string;
}> = ({ children, glow = C.red }) => {
  const frame = useCurrentFrame();
  const drift = (frame * 1.6) % 48;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage:
            "radial-gradient(ellipse 95% 62% at 50% 46%, black 15%, transparent 82%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 68% 40% at 50% 40%, ${glow}26 0%, transparent 72%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** Global progress rail — a constantly moving element that sells momentum. */
export const Rail: React.FC<{ readonly total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / total);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 7,
          backgroundColor: "rgba(255,255,255,0.09)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${p * 100}%`,
          height: 7,
          backgroundColor: C.red,
          boxShadow: `0 0 18px ${C.red}`,
        }}
      />
    </>
  );
};

/** Display line that punches in with an overshoot. */
export const Punch: React.FC<{
  readonly children: React.ReactNode;
  readonly at?: number;
  readonly size?: number;
  readonly color?: string;
  readonly style?: CSSProperties;
}> = ({ children, at = 0, size = 86, color = C.ink, style }) => {
  const s = useSnap(at);

  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: -2,
        color,
        opacity: interpolate(s, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }),
        scale: `${interpolate(s, [0, 1], [0.86, 1])}`,
        translate: `0px ${interpolate(s, [0, 1], [26, 0])}px`,
        transformOrigin: "left center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Monospace component name — the anchor of each technical card. */
export const Term: React.FC<{
  readonly children: React.ReactNode;
  readonly at?: number;
  readonly color?: string;
  readonly size?: number;
}> = ({ children, at = 0, color = C.cyan, size = 40 }) => {
  const s = useSnap(at);

  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: MONO,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: 1,
        color,
        border: `2px solid ${color}55`,
        backgroundColor: `${color}14`,
        borderRadius: 10,
        padding: "10px 20px",
        opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        scale: `${interpolate(s, [0, 1], [0.8, 1])}`,
      }}
    >
      {children}
    </div>
  );
};

/** Sans body line for the "what it does" sentence. */
export const Def: React.FC<{
  readonly children: React.ReactNode;
  readonly at?: number;
  readonly size?: number;
  readonly color?: string;
}> = ({ children, at = 0, size = 42, color = C.ink }) => {
  const s = useSnap(at);

  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: size,
        fontWeight: 600,
        lineHeight: 1.28,
        color,
        opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        translate: `0px ${interpolate(s, [0, 1], [18, 0])}px`,
      }}
    >
      {children}
    </div>
  );
};

/** Small monospace line carrying the number or trade-off that proves the point. */
export const Detail: React.FC<{
  readonly children: React.ReactNode;
  readonly at?: number;
  readonly color?: string;
  readonly size?: number;
}> = ({ children, at = 0, color = C.dim, size = 27 }) => {
  const s = useSnap(at);

  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: size,
        lineHeight: 1.45,
        color,
        opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
        translate: `${interpolate(s, [0, 1], [-14, 0])}px 0px`,
      }}
    >
      {children}
    </div>
  );
};

/** Number that races to its value, then holds. */
export const Count: React.FC<{
  readonly to: number;
  readonly at?: number;
  readonly dur?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly color?: string;
  readonly size?: number;
}> = ({
  to,
  at = 0,
  dur = 22,
  prefix = "",
  suffix = "",
  color = C.red,
  size = 128,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        fontFamily: DISPLAY,
        fontSize: size,
        letterSpacing: -3,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {Math.round(v).toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
};

/** Two-frame slam at a cut — reads as an edit accent, not a glitch. */
export const Slam: React.FC<{ readonly at?: number; readonly color?: string }> = ({
  at = 0,
  color = C.ink,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + 4], [0, 0.22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color, opacity: o, pointerEvents: "none" }} />
  );
};

/** Standard card frame: kicker rail on the left, content stacked in the margin. */
export const Card: React.FC<{
  readonly children: React.ReactNode;
  readonly accent?: string;
  readonly label?: string;
  readonly gap?: number;
}> = ({ children, accent = C.red, label, gap = 26 }) => {
  const s = useSnap(0);

  return (
    <AbsoluteFill
      style={{
        paddingLeft: M,
        paddingRight: M,
        justifyContent: "center",
        gap,
      }}
    >
      {label ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 6,
            opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <span
            style={{
              width: 34,
              height: 5,
              backgroundColor: accent,
              transformOrigin: "left center",
              scale: `${interpolate(s, [0, 1], [0, 1])} 1`,
            }}
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 3,
              color: accent,
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};
