import { useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import { C, DISPLAY, MONO, SANS } from "../theme";
import { rise } from "./Type";

type ShareBarProps = {
  /** Highlighted portion, 0–1. */
  readonly share: number;
  readonly label: string;
  readonly restLabel?: string;
  readonly color?: string;
  readonly start?: number;
  readonly style?: CSSProperties;
};

/**
 * One long bar where a slice is called out — the clearest way to show "this
 * much of that" without a legend.
 */
export const ShareBar: React.FC<ShareBarProps> = ({
  share,
  label,
  restLabel,
  color = C.red,
  start = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const grow = rise(frame, start, 30);

  return (
    <div style={{ opacity: rise(frame, start, 14), ...style }}>
      <div
        style={{
          position: "relative",
          height: 108,
          backgroundColor: "#E2DBCA",
          borderRadius: 6,
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div
          style={{
            width: `${share * 100}%`,
            backgroundColor: color,
            transformOrigin: "left center",
            scale: `${grow} 1`,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 18,
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 30,
            fontWeight: 700,
            color,
            maxWidth: "58%",
            lineHeight: 1.25,
            opacity: rise(frame, start + 16, 14),
          }}
        >
          {label}
        </div>
        {restLabel ? (
          <div
            style={{
              fontFamily: SANS,
              fontSize: 28,
              fontWeight: 500,
              color: C.inkSoft,
              textAlign: "right",
              maxWidth: "40%",
              lineHeight: 1.25,
              opacity: rise(frame, start + 24, 14),
            }}
          >
            {restLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
};

type BigStatProps = {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly label: string;
  readonly color?: string;
  readonly start?: number;
  readonly duration?: number;
  readonly size?: number;
  readonly style?: CSSProperties;
};

/** Oversized counter that ticks up to its figure. */
export const BigStat: React.FC<BigStatProps> = ({
  value,
  prefix = "",
  suffix = "",
  label,
  color = C.ink,
  start = 0,
  duration = 34,
  size = 168,
  style,
}) => {
  const frame = useCurrentFrame();
  const shown = Math.round(rise(frame, start, duration) * value);

  return (
    <div style={{ opacity: rise(frame, start, 12), ...style }}>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: -4,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {prefix}
        {shown.toLocaleString("fr-FR")}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 27,
          color: C.inkSoft,
          marginTop: 14,
          lineHeight: 1.35,
          whiteSpace: "pre-line",
        }}
      >
        {label}
      </div>
    </div>
  );
};
