import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, MONO, SANS } from "../theme";
import { fadeUp, ramp } from "./anim";

type MetricProps = {
  readonly value: number;
  readonly unit?: string;
  readonly label: string;
  readonly color?: string;
  readonly start?: number;
  readonly duration?: number;
  readonly format?: (n: number) => string;
};

/** Big counter that ticks up to its value — for headline scale figures. */
export const Metric: React.FC<MetricProps> = ({
  value,
  unit = "",
  label,
  color = COLORS.netflix,
  start = 0,
  duration = 40,
  format = (n) => Math.round(n).toLocaleString("fr-FR"),
}) => {
  const frame = useCurrentFrame();
  const shown = interpolate(ramp(frame, start, duration), [0, 1], [0, value]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        ...fadeUp(frame, start, 18),
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: -2,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {format(shown)}
        <span style={{ fontSize: 52, fontWeight: 700 }}>{unit}</span>
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          color: COLORS.textDim,
          textAlign: "center",
          lineHeight: 1.3,
          // Labels carry explicit line breaks to keep their column narrow.
          whiteSpace: "pre-line",
          maxWidth: 270,
        }}
      >
        {label}
      </div>
    </div>
  );
};

type BarProps = {
  readonly label: string;
  readonly value: string;
  readonly fill: number;
  readonly color?: string;
  readonly start?: number;
  readonly highlight?: boolean;
};

/** Labelled horizontal meter — bitrate rungs, buffer health, cache hit rate. */
export const BarMeter: React.FC<BarProps> = ({
  label,
  value,
  fill,
  color = COLORS.cyan,
  start = 0,
  highlight = false,
}) => {
  const frame = useCurrentFrame();
  const grown = ramp(frame, start, 26);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        ...fadeUp(frame, start, 14, 16),
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          color: highlight ? color : COLORS.textDim,
          width: 190,
          textAlign: "right",
          fontWeight: highlight ? 700 : 400,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "relative",
          flex: 1,
          height: 26,
          borderRadius: 6,
          backgroundColor: "rgba(255,255,255,0.06)",
          border: `1px solid ${highlight ? `${color}66` : "rgba(255,255,255,0.08)"}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 5,
            background: `linear-gradient(90deg, ${color}55, ${color})`,
            transformOrigin: "left center",
            scale: `${fill * grown} 1`,
            boxShadow: highlight ? `0 0 20px ${color}77` : "none",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 23,
          color: highlight ? color : COLORS.textDim,
          width: 150,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
};

type TerminalProps = {
  readonly lines: readonly { readonly text: string; readonly color?: string }[];
  readonly start?: number;
  readonly stagger?: number;
  readonly charsPerFrame?: number;
  readonly width?: number | string;
};

/** Monospace log panel whose lines type themselves in, character by character. */
export const Terminal: React.FC<TerminalProps> = ({
  lines,
  start = 0,
  stagger = 12,
  charsPerFrame = 1.6,
  width = "100%",
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        backgroundColor: "rgba(255,255,255,0.025)",
        padding: "26px 30px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        ...fadeUp(frame, start, 20),
      }}
    >
      {lines.map((line, i) => {
        const lineStart = start + 8 + i * stagger;
        const shown = Math.max(
          0,
          Math.floor((frame - lineStart) * charsPerFrame),
        );

        return (
          <div
            key={line.text}
            style={{
              fontFamily: MONO,
              fontSize: 25,
              lineHeight: 1.45,
              color: line.color ?? COLORS.textDim,
              whiteSpace: "pre-wrap",
              opacity: frame >= lineStart ? 1 : 0,
            }}
          >
            {line.text.slice(0, shown)}
          </div>
        );
      })}
    </div>
  );
};
