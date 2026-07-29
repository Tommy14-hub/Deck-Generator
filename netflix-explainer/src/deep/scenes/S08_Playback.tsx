import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, MONO, SANS } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Stage } from "../ui/Stage";
import { Caption, ChapterHeading } from "../ui/Chrome";
import { BarMeter } from "../ui/Data";
import { fadeUp } from "../ui/anim";

/** Ladder rungs, richest first — the player always picks the best it can sustain. */
const LADDER = [
  { label: "AV1 · 2160p", rate: 16, fill: 1, color: COLORS.netflix },
  { label: "VP9 · 1080p", rate: 5, fill: 0.42, color: COLORS.uv },
  { label: "H.264 · 720p", rate: 3, fill: 0.2, color: COLORS.cyan },
  { label: "H.264 · 480p", rate: 1, fill: 0.07, color: COLORS.green },
] as const;

const Readout: React.FC<{
  readonly label: string;
  readonly value: string;
  readonly color: string;
  readonly start: number;
}> = ({ label, value, color, start }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        ...fadeUp(frame, start, 16),
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 60,
          fontWeight: 800,
          color,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: -1,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 22, color: COLORS.textDim }}>
        {label}
      </div>
    </div>
  );
};

export const S08_Playback: React.FC = () => {
  const frame = useCurrentFrame();

  // Simulated network: healthy, then a congestion dip, then recovery.
  const bandwidth = interpolate(
    frame,
    [90, 140, 168, 212, 240, 310],
    [18, 18, 2.2, 2.2, 12, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const buffer = interpolate(
    frame,
    [90, 140, 178, 218, 252, 310],
    [100, 100, 34, 27, 88, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const activeIndex = Math.max(
    0,
    LADDER.findIndex((rung) => rung.rate <= bandwidth),
  );
  const active = LADDER[activeIndex];

  return (
    <Backdrop glow={COLORS.cyan}>
      <ChapterHeading
        accent={COLORS.cyan}
        index="07"
        subtitle="le lecteur négocie sa qualité en continu"
        title="Adaptive bitrate"
      />

      <Stage
        style={{
          top: 520,
          left: 80,
          right: 80,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          gap: 74,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Readout
            color={COLORS.cyan}
            label="débit mesuré"
            start={30}
            value={`${bandwidth.toFixed(1)} Mb/s`}
          />
          <Readout
            color={buffer < 40 ? COLORS.amber : COLORS.green}
            label="tampon"
            start={42}
            value={`${Math.round(buffer)} %`}
          />
          <Readout
            color={active.color}
            label="rung actif"
            start={54}
            value={active.label.split(" · ")[1]}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {LADDER.map((rung, i) => (
            <BarMeter
              color={rung.color}
              fill={rung.fill}
              highlight={i === activeIndex}
              key={rung.label}
              label={rung.label}
              start={70 + i * 12}
              value={`${rung.rate} Mb/s`}
            />
          ))}
        </div>
      </Stage>

      <Caption start={250}>
        Le réseau flanche ? Le lecteur descend d&apos;un barreau plutôt que de
        se figer. <strong>Mieux vaut baisser que buffériser.</strong>
      </Caption>
    </Backdrop>
  );
};
