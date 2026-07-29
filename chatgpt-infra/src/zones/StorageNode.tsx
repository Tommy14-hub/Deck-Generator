import { interpolate, useCurrentFrame } from "remotion";
import { StraightFlow } from "../components/DataFlow";
import {
  BlockStorageIllustration,
  ObjectStorageIllustration,
} from "../components/illustrations";
import { Zone } from "../camera/InfiniteCanvas";
import { METRICS, ZONES, at, stageProgress } from "../config/scenario";
import { DISPLAY, MONO, UV } from "../design/theme";

const Caption: React.FC<{
  readonly title: string;
  readonly sub: string;
  readonly accent?: string;
  readonly appear: number;
}> = ({ title, sub, accent = UV.primary, appear }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        textAlign: "center",
        opacity: t,
        translate: `0px ${(1 - t) * 18}px`,
      }}
    >
      <div style={{ fontFamily: DISPLAY, fontSize: 46, color: UV.ink, letterSpacing: -1 }}>
        {title}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 24, color: accent, marginTop: 8 }}>{sub}</div>
    </div>
  );
};

/**
 * Stage 1 — the model has to exist on local disk before anything else happens.
 * 140 GB of weights are pulled out of object storage and decoded onto NVMe,
 * which is why the CPU pins long before a single GPU is involved.
 */
export const StorageNode: React.FC = () => {
  const frame = useCurrentFrame();
  const p = stageProgress(frame, "boot");

  // The pile of shards drains as the download completes.
  const shards = 12;

  return (
    <>
      <Zone x={ZONES.objectStorage.x} y={ZONES.objectStorage.y}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <ObjectStorageIllustration size={460} style={{ color: UV.primary }} />
          <Caption
            appear={at("boot", 0.02)}
            sub="s3 · 140 GB de poids"
            title="Object Storage"
          />
        </div>
      </Zone>

      {/* Shard ledger: what is still to come down the pipe. */}
      <Zone x={ZONES.objectStorage.x + 520} y={ZONES.objectStorage.y + 40}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: shards }, (_, i) => {
            const done = p * shards > i;

            return (
              <div
                key={i}
                style={{
                  width: 190,
                  height: 26,
                  borderRadius: 5,
                  border: `2px solid ${done ? UV.primary : UV.border}`,
                  backgroundColor: done ? UV.primaryWash : "transparent",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 10,
                  fontFamily: MONO,
                  fontSize: 14,
                  color: done ? UV.primary : UV.inkFaint,
                  opacity: interpolate(frame, [at("boot", 0.04) + i * 3, at("boot", 0.04) + i * 3 + 12], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                shard-{String(i).padStart(2, "0")}.safetensors
              </div>
            );
          })}
        </div>
      </Zone>

      {/* S3 → NVMe. Slow, wide pipe: this is a bulk transfer, not a hot path. */}
      <Zone
        x={ZONES.objectStorage.x}
        y={(ZONES.objectStorage.y + ZONES.nvme.y) / 2 + 60}
      >
        <StraightFlow
          color={UV.primary}
          dash={[22, 30]}
          length={620}
          speed={5}
          start={at("boot", 0.08)}
          thickness={10}
        />
      </Zone>

      <Zone x={ZONES.nvme.x} y={ZONES.nvme.y}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <BlockStorageIllustration size={340} style={{ color: UV.primaryDeep }} />
          <Caption
            accent={UV.primaryDeep}
            appear={at("boot", 0.3)}
            sub="nvme local · décodage safetensors"
            title="Block Storage"
          />
        </div>
      </Zone>

      {/* NVMe → RAM. Starts only once decode is under way. */}
      <Zone x={ZONES.nvme.x + 700} y={ZONES.nvme.y + 90}>
        <StraightFlow
          axis="x"
          color={UV.success}
          dash={[18, 24]}
          length={640}
          speed={6}
          start={at("boot", 0.55)}
          thickness={9}
        />
      </Zone>

      <Zone x={ZONES.systemRam.x} y={ZONES.systemRam.y}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 6,
              width: 380,
            }}
          >
            {Array.from({ length: 36 }, (_, i) => {
              const filled = stageProgress(frame, "boot") * 36 > i;

              return (
                <div
                  key={i}
                  style={{
                    height: 34,
                    borderRadius: 4,
                    backgroundColor: filled ? UV.success : UV.bgStrong,
                  }}
                />
              );
            })}
          </div>
          <Caption
            accent={UV.success}
            appear={at("boot", 0.6)}
            sub={`${METRICS.systemRamGb} GB · tampon hôte`}
            title="System RAM"
          />
        </div>
      </Zone>
    </>
  );
};
