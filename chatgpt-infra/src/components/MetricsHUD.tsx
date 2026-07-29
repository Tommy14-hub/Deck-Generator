import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { DISPLAY, MONO, UV } from "../design/theme";

export type MetricState = "idle" | "active" | "saturated";

export type MetricsHUDProps = {
  /** Short instrument name, e.g. "PCIe Gen 4.0 Bandwidth". */
  readonly label: string;
  /** Caller owns the animation; the HUD only formats what it is handed. */
  readonly value: number | string;
  readonly unit?: string;
  /** Optional fill bar, 0→1. Omit for a bare readout. */
  readonly progress?: number;
  /** Right-hand ceiling caption, e.g. "/ 140 GB". */
  readonly ceiling?: string;
  readonly state?: MetricState;
  readonly accent?: string;
  readonly decimals?: number;
  readonly width?: number | string;
  readonly style?: CSSProperties;
};

const STATE_COLOR: Record<MetricState, string> = {
  idle: UV.inkFaint,
  active: UV.success,
  saturated: UV.danger,
};

/**
 * A single instrument readout.
 *
 * Presentational on purpose: it takes an already-animated `value` rather than
 * a from/to pair, so one component serves counters, bandwidth gauges and
 * allocation meters without any of them fighting over the timing model.
 */
export const MetricsHUD: React.FC<MetricsHUDProps> = ({
  label,
  value,
  unit,
  progress,
  ceiling,
  state = "active",
  accent = UV.primary,
  decimals = 0,
  width = 400,
  style,
}) => {
  const frame = useCurrentFrame();

  const shown =
    typeof value === "number"
      ? value.toLocaleString("fr-FR", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : value;

  // A slow blink keeps the panel feeling instrumented rather than printed.
  const blink =
    state === "idle"
      ? 0.35
      : interpolate(Math.sin((frame / 22) * Math.PI * 2), [-1, 1], [0.45, 1]);

  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        backgroundColor: UV.bg,
        border: `1px solid ${UV.border}`,
        borderRadius: 14,
        padding: "18px 22px 20px",
        boxShadow: "0 10px 30px rgba(21, 26, 45, 0.10)",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 9,
            flexShrink: 0,
            backgroundColor: STATE_COLOR[state],
            opacity: blink,
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: UV.inkSoft,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginTop: 10,
        }}
      >
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 52,
            lineHeight: 1,
            letterSpacing: -1.5,
            color: UV.ink,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {shown}
        </span>
        {unit ? (
          <span
            style={{
              fontFamily: MONO,
              fontSize: 25,
              fontWeight: 700,
              color: accent,
            }}
          >
            {unit}
          </span>
        ) : null}
        {ceiling ? (
          <span
            style={{
              fontFamily: MONO,
              fontSize: 19,
              color: UV.inkFaint,
              marginLeft: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {ceiling}
          </span>
        ) : null}
      </div>

      {progress === undefined ? null : (
        <div
          style={{
            marginTop: 14,
            height: 8,
            borderRadius: 4,
            backgroundColor: UV.bgStrong,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 4,
              backgroundColor: state === "saturated" ? UV.danger : accent,
              transformOrigin: "left center",
              // scaleX keeps the fill on the compositor instead of relayouting.
              scale: `${Math.max(0, Math.min(1, progress))} 1`,
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Screen-fixed column for stacking readouts. Lives outside the camera
 * transform so the instruments stay legible while the world moves under them.
 */
export const HUDStack: React.FC<{
  readonly children: React.ReactNode;
  readonly side?: "left" | "right";
  readonly top?: number;
  readonly gap?: number;
}> = ({ children, side = "left", top = 140, gap = 16 }) => (
  <div
    style={{
      position: "absolute",
      top,
      [side]: 56,
      display: "flex",
      flexDirection: "column",
      gap,
      pointerEvents: "none",
    }}
  >
    {children}
  </div>
);
