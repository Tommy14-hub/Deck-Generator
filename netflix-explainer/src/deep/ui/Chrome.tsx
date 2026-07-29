import { useCurrentFrame } from "remotion";
import { COLORS, MONO, SANS, SAFE_X } from "../theme";
import { fadeUp, ramp } from "./anim";

type HeadingProps = {
  readonly index: string;
  readonly title: string;
  readonly subtitle: string;
  readonly accent?: string;
  readonly start?: number;
};

/** Chapter slate pinned to the top of every technical scene. */
export const ChapterHeading: React.FC<HeadingProps> = ({
  index,
  title,
  subtitle,
  accent = COLORS.netflix,
  start = 0,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 132,
        left: SAFE_X,
        right: SAFE_X,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          ...fadeUp(frame, start, 16),
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 32,
            fontWeight: 700,
            color: accent,
            letterSpacing: 1,
          }}
        >
          {index}
        </span>
        <div
          style={{
            height: 2,
            flex: 1,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            scale: `${ramp(frame, start + 4, 26)} 1`,
            transformOrigin: "left center",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 18,
          fontFamily: SANS,
          fontSize: 76,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -1.5,
          color: COLORS.text,
          ...fadeUp(frame, start + 5, 24),
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 14,
          fontFamily: MONO,
          fontSize: 30,
          fontWeight: 400,
          color: COLORS.textDim,
          ...fadeUp(frame, start + 11, 18),
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

type CaptionProps = {
  readonly children: React.ReactNode;
  readonly start?: number;
  readonly bottom?: number;
};

/** Plain-language takeaway anchored near the bottom of the frame. */
export const Caption: React.FC<CaptionProps> = ({
  children,
  start = 0,
  bottom = 150,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: SAFE_X,
        right: SAFE_X,
        fontFamily: SANS,
        fontSize: 40,
        fontWeight: 500,
        lineHeight: 1.35,
        textAlign: "center",
        color: COLORS.textDim,
        ...fadeUp(frame, start, 18),
      }}
    >
      {children}
    </div>
  );
};

type TagProps = {
  readonly label: string;
  readonly color?: string;
  readonly start?: number;
};

/** Small monospace pill used to name protocols and components. */
export const Tag: React.FC<TagProps> = ({
  label,
  color = COLORS.cyan,
  start = 0,
}) => {
  const frame = useCurrentFrame();

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: MONO,
        fontSize: 24,
        fontWeight: 500,
        color,
        border: `1.5px solid ${color}55`,
        backgroundColor: `${color}12`,
        borderRadius: 8,
        padding: "7px 16px",
        whiteSpace: "nowrap",
        ...fadeUp(frame, start, 12, 14),
      }}
    >
      {label}
    </span>
  );
};
