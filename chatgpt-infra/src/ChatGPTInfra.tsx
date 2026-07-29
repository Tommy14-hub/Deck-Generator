import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CameraController } from "./camera/CameraController";
import { InfiniteCanvas } from "./camera/InfiniteCanvas";
import { HUDStack, MetricsHUD } from "./components/MetricsHUD";
import {
  DURATION,
  METRICS,
  STAGES,
  STAGE_RANGES,
  stageProgress,
} from "./config/scenario";
import type { StageId } from "./config/scenario";
import { DISPLAY, MONO, UV } from "./design/theme";
import { PCIeBus } from "./zones/PCIeBus";
import { PagedAttention } from "./zones/PagedAttention";
import { SXMCluster } from "./zones/SXMCluster";
import { StorageNode } from "./zones/StorageNode";

/** Instruments swap with the stage; the camera never cuts, so the HUD carries
 *  the "what am I looking at" job that a scene change would normally do. */
const StageInstruments: React.FC<{ readonly stage: StageId }> = ({ stage }) => {
  const frame = useCurrentFrame();

  if (stage === "boot") {
    const p = stageProgress(frame, "boot");
    const cpu =
      METRICS.cpuIdlePct + Math.min(1, p * 1.4) * (METRICS.cpuDecodePct - METRICS.cpuIdlePct);

    return (
      <>
        <MetricsHUD
          ceiling={`/ ${METRICS.weightsGb} GB`}
          decimals={1}
          label="Download S3 → NVMe"
          progress={p}
          state={p >= 1 ? "saturated" : "active"}
          unit="GB"
          value={p * METRICS.weightsGb}
        />
        <MetricsHUD accent={UV.info} label="CPU Load" progress={cpu / 100} unit="%" value={cpu} />
        <MetricsHUD
          accent={UV.success}
          ceiling={`/ ${METRICS.systemRamGb} GB`}
          label="System RAM"
          progress={p}
          unit="GB"
          value={p * METRICS.systemRamGb}
        />
      </>
    );
  }

  if (stage === "pcie") {
    const p = stageProgress(frame, "pcie");
    const weights = Math.min(1, p * 1.6) * METRICS.vramWeightsGb;
    const overhead =
      interpolate(p, [0.55, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
      METRICS.vramOverheadGb;

    return (
      <>
        <MetricsHUD
          accent={UV.info}
          ceiling="saturé"
          label="PCIe Gen 4.0 Bandwidth"
          progress={1}
          state="saturated"
          unit="GB/s"
          value={METRICS.pcieGbs}
        />
        <MetricsHUD
          ceiling="/ 80 GB HBM3"
          decimals={1}
          label="VRAM · Model Weights"
          progress={weights / 80}
          unit="GB"
          value={weights}
        />
        <MetricsHUD
          accent={UV.inkSoft}
          decimals={1}
          label="VRAM · Framework Overhead"
          progress={overhead / 80}
          state="idle"
          unit="GB"
          value={overhead}
        />
      </>
    );
  }

  if (stage === "sxm") {
    const p = stageProgress(frame, "sxm");
    const nv = interpolate(p, [0.42, 0.66], [0, METRICS.nvlinkGbs], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <>
        <MetricsHUD
          accent={UV.warningInk}
          ceiling={`${Math.round(METRICS.nvlinkGbs / METRICS.pcieGbs)}× le PCIe`}
          label="NVLink Interconnect"
          progress={nv / METRICS.nvlinkGbs}
          state={nv > METRICS.nvlinkGbs * 0.9 ? "saturated" : "active"}
          unit="GB/s"
          value={nv}
        />
        <MetricsHUD
          accent={UV.info}
          label="PCIe Gen 4.0"
          progress={METRICS.pcieGbs / METRICS.nvlinkGbs}
          state="idle"
          unit="GB/s"
          value={METRICS.pcieGbs}
        />
        <MetricsHUD
          label="Tensor Parallelism"
          unit="TP"
          value={`×${METRICS.tensorParallel}`}
        />
      </>
    );
  }

  const p = stageProgress(frame, "inference");
  const kv = Math.floor(interpolate(p, [0.15, 0.92], [0, 34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })) * METRICS.kvBlockMb;
  const ttft = interpolate(p, [0.2, 0.4], [METRICS.ttftMs * 2.4, METRICS.ttftMs * 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tps = interpolate(p, [0.3, 0.78], [0, METRICS.throughputTokensPerSec], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <MetricsHUD
        accent={UV.cyan}
        ceiling={`blocs de ${METRICS.kvBlockMb} MB`}
        label="KV Cache Size"
        progress={kv / 20000}
        unit="MB"
        value={kv}
      />
      <MetricsHUD
        accent={ttft < METRICS.ttftMs ? UV.success : UV.danger}
        ceiling={`cible < ${METRICS.ttftMs} ms`}
        label="TTFT"
        state={ttft < METRICS.ttftMs ? "active" : "saturated"}
        unit="ms"
        value={Math.round(ttft)}
      />
      <MetricsHUD
        accent={UV.success}
        label="Throughput"
        progress={tps / METRICS.throughputTokensPerSec}
        unit="tok/s"
        value={Math.round(tps)}
      />
    </>
  );
};

export const ChatGPTInfra: React.FC = () => {
  const frame = useCurrentFrame();
  const active =
    STAGES.find((s) => frame < STAGE_RANGES[s.id].end) ?? STAGES[STAGES.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: UV.bgSoft }}>
      <CameraController>
        <InfiniteCanvas>
          <StorageNode />
          <PCIeBus />
          <SXMCluster />
          <PagedAttention />
        </InfiniteCanvas>
      </CameraController>

      {/* Scrims. The canvas keeps moving under the chrome, so the instruments
          need a guaranteed contrast floor rather than luck. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${UV.bgSoft}F2 0%, ${UV.bgSoft}D9 16%, transparent 34%)`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(0deg, ${UV.bgSoft}F5 0%, ${UV.bgSoft}CC 9%, transparent 18%)`,
          pointerEvents: "none",
        }}
      />

      {/* Chrome sits outside the camera transform. */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 56,
          right: 56,
          display: "flex",
          alignItems: "baseline",
          gap: 14,
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 30, color: UV.ink, letterSpacing: -0.5 }}>
          Comment tourne un LLM
        </span>
        <span style={{ fontFamily: MONO, fontSize: 18, color: UV.inkFaint, marginLeft: "auto" }}>
          {String(Math.floor(frame / 30)).padStart(3, "0")} s
        </span>
      </div>

      <HUDStack top={130}>
        <StageInstruments stage={active.id} />
      </HUDStack>

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 64,
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        {STAGES.map((s) => {
          const on = s.id === active.id;
          const done = frame >= STAGE_RANGES[s.id].end;

          return (
            <div key={s.id} style={{ flex: 1 }}>
              <div style={{ height: 6, borderRadius: 3, backgroundColor: UV.bgStrong, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    backgroundColor: UV.primary,
                    transformOrigin: "left center",
                    scale: `${done ? 1 : on ? stageProgress(frame, s.id) : 0} 1`,
                  }}
                />
              </div>
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
        <div style={{ fontFamily: MONO, fontSize: 15, color: UV.inkFaint }}>
          {Math.round((frame / DURATION) * 100)} %
        </div>
      </div>
    </AbsoluteFill>
  );
};
