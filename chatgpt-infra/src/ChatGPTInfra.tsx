import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HUDStack, MetricsHUD } from "./components/MetricsHUD";
import { METRICS, stageProgress } from "./config/scenario";
import { DISPLAY, MONO, UV } from "./design/theme";

/**
 * Film shell.
 *
 * Step 1 of the build: the stage, the parametric clock and the HUD are wired
 * together and rendering. <InfiniteCanvas> and <CameraController> drop in here
 * next — the world will mount inside this component and the HUD stays outside
 * the camera transform.
 */
export const ChatGPTInfra: React.FC = () => {
  const frame = useCurrentFrame();

  const boot = stageProgress(frame, "boot");
  const downloaded = boot * METRICS.weightsGb;
  const ram = boot * METRICS.systemRamGb;
  const cpu =
    METRICS.cpuIdlePct +
    Math.min(1, boot * 1.4) * (METRICS.cpuDecodePct - METRICS.cpuIdlePct);

  return (
    <AbsoluteFill style={{ backgroundColor: UV.bgSoft, overflow: "hidden" }}>
      {/* Blueprint grid — stands in for the canvas until it mounts. */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${UV.borderSoft} 1px, transparent 1px), linear-gradient(90deg, ${UV.borderSoft} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          paddingLeft: 80,
          paddingRight: 80,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: UV.primary,
            fontWeight: 700,
          }}
        >
          étape 01 · {Math.round(boot * 100)} %
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 64,
            letterSpacing: -2,
            color: UV.ink,
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          Chargement
          <br />
          des poids
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            color: UV.inkFaint,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          canvas + caméra : prochaine étape
        </div>
      </AbsoluteFill>

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
    </AbsoluteFill>
  );
};
