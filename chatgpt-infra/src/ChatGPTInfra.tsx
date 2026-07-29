import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CameraController } from "./camera/CameraController";
import { InfiniteCanvas, Zone } from "./camera/InfiniteCanvas";
import { HUDStack, MetricsHUD } from "./components/MetricsHUD";
import { DURATION, METRICS, STAGES, STAGE_RANGES, ZONES, stageProgress } from "./config/scenario";
import { DISPLAY, MONO, UV } from "./design/theme";

/** Blockout marker — stands in for a subject until its component lands. */
const Placeholder: React.FC<{
  readonly name: string;
  readonly w?: number;
  readonly h?: number;
  readonly accent?: string;
}> = ({ name, w = 460, h = 320, accent = UV.primary }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 22,
      border: `3px dashed ${accent}66`,
      backgroundColor: `${accent}0D`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    }}
  >
    <div style={{ fontFamily: DISPLAY, fontSize: 34, color: accent, letterSpacing: -0.5 }}>
      {name}
    </div>
    <div style={{ fontFamily: MONO, fontSize: 18, color: UV.inkFaint }}>à venir</div>
  </div>
);

const MARKERS = [
  { key: "objectStorage", name: "Object Storage", accent: UV.primary, w: 520, h: 420 },
  { key: "nvme", name: "NVMe · Block Storage", accent: UV.primary, w: 520, h: 300 },
  { key: "systemRam", name: "System RAM", accent: UV.success, w: 420, h: 260 },
  { key: "pcieBus", name: "PCIe Gen 4.0", accent: UV.info, w: 380, h: 200 },
  { key: "gpuDie", name: "GPU · H100", accent: UV.info, w: 420, h: 300 },
  { key: "vramMap", name: "VRAM Allocation", accent: UV.info, w: 480, h: 260 },
  { key: "sxmBoard", name: "SXM · 8 GPUs", accent: UV.warningInk, w: 900, h: 620 },
  { key: "requests", name: "Requêtes", accent: UV.danger, w: 380, h: 240 },
  { key: "kvCache", name: "PagedAttention · KV", accent: UV.cyan, w: 520, h: 340 },
] as const;

export const ChatGPTInfra: React.FC = () => {
  const frame = useCurrentFrame();

  const boot = stageProgress(frame, "boot");
  const downloaded = boot * METRICS.weightsGb;
  const ram = boot * METRICS.systemRamGb;
  const cpu =
    METRICS.cpuIdlePct +
    Math.min(1, boot * 1.4) * (METRICS.cpuDecodePct - METRICS.cpuIdlePct);

  const active =
    STAGES.find((s) => frame < STAGE_RANGES[s.id].end) ?? STAGES[STAGES.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: UV.bgSoft }}>
      <CameraController>
        <InfiniteCanvas>
          {MARKERS.map((m) => {
            const pos = ZONES[m.key];

            return (
              <Zone key={m.key} x={pos.x} y={pos.y}>
                <Placeholder accent={m.accent} h={m.h} name={m.name} w={m.w} />
              </Zone>
            );
          })}
        </InfiniteCanvas>
      </CameraController>

      {/* Instruments live outside the transform so they stay frame-fixed. */}
      <HUDStack>
        <MetricsHUD
          ceiling={`/ ${METRICS.weightsGb} GB`}
          decimals={1}
          label="Download S3 → NVMe"
          progress={downloaded / METRICS.weightsGb}
          state={boot >= 1 ? "saturated" : "active"}
          unit="GB"
          value={downloaded}
        />
        <MetricsHUD
          accent={UV.info}
          label="CPU Load"
          progress={cpu / 100}
          unit="%"
          value={cpu}
        />
        <MetricsHUD
          accent={UV.success}
          ceiling={`/ ${METRICS.systemRamGb} GB`}
          label="System RAM"
          progress={ram / METRICS.systemRamGb}
          unit="GB"
          value={ram}
        />
      </HUDStack>

      {/* Timeline strip: which stage the camera is currently over. */}
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 74,
          display: "flex",
          gap: 10,
        }}
      >
        {STAGES.map((s) => {
          const on = s.id === active.id;

          return (
            <div key={s.id} style={{ flex: 1 }}>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: on ? UV.primary : UV.bgStrong,
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  fontFamily: MONO,
                  fontSize: 15,
                  color: on ? UV.primary : UV.inkFaint,
                  fontWeight: on ? 700 : 400,
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 15,
            color: UV.inkFaint,
            alignSelf: "flex-end",
          }}
        >
          {Math.round((frame / DURATION) * 100)} %
        </div>
      </div>
    </AbsoluteFill>
  );
};
