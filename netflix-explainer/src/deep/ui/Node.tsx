import { useCurrentFrame } from "remotion";
import { COLORS, MONO, accent, iconTheme } from "../theme";
import type { IconTone } from "../theme";
import type { UvIconProps } from "../icons";
import { fadeUp, pop, pulse } from "./anim";

type Props = {
  readonly icon: React.FC<UvIconProps>;
  readonly label: string;
  readonly sublabel?: string;
  readonly tone?: IconTone;
  readonly size?: number;
  readonly start?: number;
  /** Draws a live ring around the plate to mark the active hop in a flow. */
  readonly live?: boolean;
};

/**
 * One infrastructure component: Ultraviolet product icon on a panel, named in
 * monospace so the diagram reads like architecture documentation.
 */
export const InfraNode: React.FC<Props> = ({
  icon: Icon,
  label,
  sublabel,
  tone = "neutral",
  size = 108,
  start = 0,
  live = false,
}) => {
  const frame = useCurrentFrame();
  const tint = accent(tone);
  const glow = live ? 0.35 + pulse(frame, 34) * 0.65 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        width: size + 72,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: size + 40,
          height: size + 40,
          borderRadius: 26,
          backgroundColor: COLORS.surface,
          border: `1.5px solid ${live ? `${tint}${Math.round(glow * 140 + 40).toString(16).padStart(2, "0")}` : COLORS.border}`,
          boxShadow: live
            ? `0 0 ${28 * glow}px ${tint}${Math.round(glow * 90).toString(16).padStart(2, "0")}`
            : "none",
          ...pop(frame, start),
        }}
      >
        <div style={iconTheme(tone)}>
          <Icon size={size} />
        </div>
      </div>

      <div
        style={{
          fontFamily: MONO,
          fontSize: 23,
          fontWeight: 500,
          color: COLORS.text,
          textAlign: "center",
          lineHeight: 1.25,
          ...fadeUp(frame, start + 6, 10, 14),
        }}
      >
        {label}
      </div>

      {sublabel ? (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 19,
            color: tint,
            textAlign: "center",
            marginTop: -8,
            ...fadeUp(frame, start + 9, 8, 14),
          }}
        >
          {sublabel}
        </div>
      ) : null}
    </div>
  );
};
