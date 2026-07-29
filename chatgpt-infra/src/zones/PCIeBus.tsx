import { interpolate, useCurrentFrame } from "remotion";
import { StraightFlow } from "../components/DataFlow";
import { Zone } from "../camera/InfiniteCanvas";
import { FLOW_SPEED, METRICS, ZONES, at, stageProgress } from "../config/scenario";
import { DISPLAY, MONO, UV } from "../design/theme";

/** Sixteen lanes, drawn individually so the bus reads as finite hardware. */
const LANES = 16;

const Label: React.FC<{
  readonly title: string;
  readonly sub: string;
  readonly accent?: string;
  readonly appear: number;
  readonly align?: "center" | "left";
}> = ({ title, sub, accent = UV.info, appear, align = "center" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ textAlign: align, opacity: t, translate: `0px ${(1 - t) * 16}px` }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 42, color: UV.ink, letterSpacing: -1 }}>
        {title}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 23, color: accent, marginTop: 7 }}>{sub}</div>
    </div>
  );
};

/**
 * Stage 2 — the physical bottleneck.
 *
 * Weights sit in host RAM and have to cross PCIe to reach the GPU. The bus is
 * drawn as sixteen discrete lanes running at a deliberately restrained speed,
 * so that when NVLink appears in stage 3 at 10x the dash rate the contrast is
 * something the eye measures rather than something a caption claims.
 */
export const PCIeBus: React.FC = () => {
  const frame = useCurrentFrame();
  const p = stageProgress(frame, "pcie");

  const vramWeights = Math.min(1, p * 1.6) * METRICS.vramWeightsGb;
  const vramOverhead =
    interpolate(p, [0.55, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    METRICS.vramOverheadGb;

  return (
    <>
      {/* The bus itself */}
      <Zone x={ZONES.pcieBus.x} y={ZONES.pcieBus.y}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {Array.from({ length: LANES }, (_, i) => (
              <StraightFlow
                axis="x"
                color={UV.info}
                dash={[14, 20]}
                key={i}
                length={520}
                rail
                speed={FLOW_SPEED.pcie}
                start={at("pcie", 0.05) + i * 1.5}
                thickness={5}
              />
            ))}
          </div>
          <Label
            appear={at("pcie", 0.12)}
            sub={`${LANES} lanes · ${METRICS.pcieGbs} GB/s partagés`}
            title="PCIe Gen 4.0"
          />
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              color: UV.danger,
              backgroundColor: UV.dangerWash,
              border: `2px solid ${UV.danger}44`,
              borderRadius: 8,
              padding: "8px 16px",
              opacity: interpolate(frame, [at("pcie", 0.3), at("pcie", 0.38)], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            ⚠ goulot d&apos;étranglement physique
          </div>
        </div>
      </Zone>

      {/* GPU die */}
      <Zone x={ZONES.gpuDie.x} y={ZONES.gpuDie.y}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <GpuDie appear={at("pcie", 0.2)} />
          <Label
            appear={at("pcie", 0.45)}
            sub="80 GB HBM3 · SXM5"
            title="NVIDIA H100"
          />
        </div>
      </Zone>

      {/* VRAM allocation map */}
      <Zone x={ZONES.vramMap.x} y={ZONES.vramMap.y}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <VramMap overheadGb={vramOverhead} weightsGb={vramWeights} />
          <Label
            accent={UV.primary}
            appear={at("pcie", 0.6)}
            sub={`${METRICS.vramWeightsGb} GB poids + ${METRICS.vramOverheadGb} GB overhead`}
            title="VRAM Allocation"
          />
        </div>
      </Zone>
    </>
  );
};

/** Stylised H100 package: substrate, die, HBM stacks. */
const GpuDie: React.FC<{ readonly appear: number }> = ({ appear }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 0.55 + (Math.sin(frame / 12) + 1) / 2 * 0.45;

  return (
    <svg
      fill="none"
      height={340}
      style={{ opacity: t, scale: `${0.9 + t * 0.1}` }}
      viewBox="0 0 460 340"
      width={460}
    >
      {/* substrate */}
      <rect fill={UV.bgStrong} height={320} rx={14} stroke={UV.border} strokeWidth={3} width={440} x={10} y={10} />
      {/* HBM stacks, three per side */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect fill={UV.infoWash} height={74} rx={6} stroke={UV.info} strokeWidth={2.5} width={70} x={34} y={46 + i * 90} />
          <rect fill={UV.infoWash} height={74} rx={6} stroke={UV.info} strokeWidth={2.5} width={70} x={356} y={46 + i * 90} />
        </g>
      ))}
      {/* compute die */}
      <rect
        fill={UV.primaryWash}
        height={244}
        rx={10}
        stroke={UV.primary}
        strokeWidth={3.5}
        width={216}
        x={122}
        y={48}
      />
      {/* SM grid, lit by the pulse */}
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => (
          <rect
            fill={UV.primary}
            height={20}
            key={`${r}-${c}`}
            opacity={pulse * (0.35 + ((r * 6 + c) % 5) * 0.13)}
            rx={3}
            width={28}
            x={136 + c * 32}
            y={62 + r * 28}
          />
        )),
      )}
      <text
        fill={UV.primaryDeep}
        fontFamily={MONO}
        fontSize={17}
        fontWeight={700}
        textAnchor="middle"
        x={230}
        y={310}
      >
        H100 SXM5
      </text>
    </svg>
  );
};

/** 80 GB of HBM as a block map: weights fixed, overhead grey, rest free. */
const VramMap: React.FC<{
  readonly weightsGb: number;
  readonly overheadGb: number;
}> = ({ weightsGb, overheadGb }) => {
  const TOTAL_GB = 80;
  const COLS = 16;
  const ROWS = 5;
  const cells = COLS * ROWS;
  const gbPerCell = TOTAL_GB / cells;

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 5, width: 560 }}>
      {Array.from({ length: cells }, (_, i) => {
        const gb = (i + 1) * gbPerCell;
        const isWeights = gb <= weightsGb;
        const isOverhead = !isWeights && gb <= weightsGb + overheadGb;

        return (
          <div
            key={i}
            style={{
              height: 26,
              borderRadius: 3,
              backgroundColor: isWeights
                ? UV.primary
                : isOverhead
                  ? UV.inkFaint
                  : UV.bgStrong,
            }}
          />
        );
      })}
    </div>
  );
};
