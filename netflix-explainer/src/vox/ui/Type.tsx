import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import { C, DISPLAY, MARGIN, MONO, SANS } from "../theme";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const rise = (frame: number, start: number, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Warm paper stage with editorial margins. */
export const Paper: React.FC<{
  readonly children: React.ReactNode;
  readonly bg?: string;
}> = ({ children, bg = C.paper }) => (
  <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
    {children}
  </AbsoluteFill>
);

/** Small label with a colour chip — sets the section without stealing focus. */
export const Kicker: React.FC<{
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly start?: number;
  readonly style?: CSSProperties;
}> = ({ children, color = C.red, start = 0, style }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: rise(frame, start, 12),
        ...style,
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          backgroundColor: color,
          borderRadius: 3,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 27,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: C.ink,
        }}
      >
        {children}
      </span>
    </div>
  );
};

type HeadlineProps = {
  readonly lines: readonly React.ReactNode[];
  readonly size?: number;
  readonly start?: number;
  readonly stagger?: number;
  readonly color?: string;
  readonly align?: CSSProperties["textAlign"];
  readonly style?: CSSProperties;
};

/**
 * Display type revealed one line at a time, each sliding up from behind a
 * mask — the cadence that carries a silent explainer.
 */
export const Headline: React.FC<HeadlineProps> = ({
  lines,
  size = 92,
  start = 0,
  stagger = 9,
  color = C.ink,
  align = "left",
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ textAlign: align, ...style }}>
      {lines.map((line, i) => {
        const t = rise(frame, start + i * stagger, 22);

        return (
          <div
            // Lines are positional, not reorderable.
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            style={{ overflow: "hidden", paddingBottom: "0.06em" }}
          >
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: size,
                lineHeight: 1.06,
                letterSpacing: -1.5,
                color,
                translate: `0px ${(1 - t) * 100}%`,
                opacity: t > 0 ? 1 : 0,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Supporting sentence under a headline. */
export const Body: React.FC<{
  readonly children: React.ReactNode;
  readonly start?: number;
  readonly size?: number;
  readonly style?: CSSProperties;
}> = ({ children, start = 0, size = 40, style }) => {
  const frame = useCurrentFrame();
  const t = rise(frame, start, 20);

  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: size,
        fontWeight: 500,
        lineHeight: 1.38,
        color: C.inkSoft,
        opacity: t,
        translate: `0px ${(1 - t) * 16}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Citation in the bottom margin, the way a published chart carries one. */
export const Source: React.FC<{
  readonly children: React.ReactNode;
  readonly start?: number;
  readonly color?: string;
}> = ({ children, start = 0, color = C.inkSoft }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN,
        bottom: 64,
        fontFamily: MONO,
        fontSize: 21,
        color,
        opacity: rise(frame, start, 16) * 0.85,
      }}
    >
      {children}
    </div>
  );
};

/** Full-bleed punctuation card between chapters. */
export const TitleCard: React.FC<{
  readonly lines: readonly React.ReactNode[];
  readonly start?: number;
  readonly bg?: string;
  readonly color?: string;
  readonly size?: number;
}> = ({ lines, start = 0, bg = C.ink, color = C.white, size = 104 }) => (
  <Paper bg={bg}>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        paddingLeft: MARGIN,
        paddingRight: MARGIN,
      }}
    >
      <Headline
        color={color}
        lines={lines}
        size={size}
        stagger={8}
        start={start}
      />
    </AbsoluteFill>
  </Paper>
);
