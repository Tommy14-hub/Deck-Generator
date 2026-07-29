import { interpolate, useCurrentFrame } from "remotion";
import { DataFlow } from "../components/DataFlow";
import { Zone } from "../camera/InfiniteCanvas";
import { FLOW_SPEED, METRICS, ZONES, at, stageProgress } from "../config/scenario";
import { DISPLAY, MONO, UV } from "../design/theme";

const BOARD = { w: 1500, h: 1040 };
const GRID = { cols: 4, rows: 2 };
const GPU = { w: 290, h: 380 };
const GAP_X = 46;
const GAP_Y = 60;

/** Top-left corner of GPU i on the board. */
const gpuPos = (i: number) => {
  const col = i % GRID.cols;
  const row = Math.floor(i / GRID.cols);
  const totalW = GRID.cols * GPU.w + (GRID.cols - 1) * GAP_X;
  const totalH = GRID.rows * GPU.h + (GRID.rows - 1) * GAP_Y;

  return {
    x: (BOARD.w - totalW) / 2 + col * (GPU.w + GAP_X),
    y: (BOARD.h - totalH) / 2 + row * (GPU.h + GAP_Y),
  };
};

/**
 * Stage 3 — the model does not fit on one card, so it is sharded.
 *
 * Eight H100s are soldered to one SXM baseboard. A weight matrix is cut into
 * eight column slices (tensor parallelism, TP=8) and every GPU holds one. Each
 * token then requires an all-reduce across all eight, which is why the
 * interconnect between them matters far more than the PCIe link that fed them.
 */
export const SXMCluster: React.FC = () => {
  const frame = useCurrentFrame();
  const p = stageProgress(frame, "sxm");

  const shardIn = at("sxm", 0.28);
  const linkIn = at("sxm", 0.5);

  return (
    <Zone x={ZONES.sxmBoard.x} y={ZONES.sxmBoard.y}>
      <div style={{ position: "relative", width: BOARD.w, height: BOARD.h + 150 }}>
        {/* Baseboard */}
        <div
          style={{
            position: "absolute",
            inset: `0 0 150px 0`,
            borderRadius: 26,
            backgroundColor: UV.bg,
            border: `4px solid ${UV.border}`,
            boxShadow: "0 24px 60px rgba(21,26,45,0.10)",
          }}
        />

        {/* NVLink mesh, drawn under the packages */}
        <svg
          height={BOARD.h}
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}
          width={BOARD.w}
        >
          {Array.from({ length: 8 }, (_, i) =>
            Array.from({ length: 8 }, (_, j) => {
              if (j <= i) return null;
              const a = gpuPos(i);
              const b = gpuPos(j);
              const ax = a.x + GPU.w / 2;
              const ay = a.y + GPU.h / 2;
              const bx = b.x + GPU.w / 2;
              const by = b.y + GPU.h / 2;

              return (
                <line
                  key={`${i}-${j}`}
                  opacity={interpolate(frame, [linkIn, linkIn + 24], [0, 0.16], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                  stroke={UV.warningInk}
                  strokeWidth={3}
                  x1={ax}
                  x2={bx}
                  y1={ay}
                  y2={by}
                />
              );
            }),
          )}
        </svg>

        {/* Fast NVLink traffic on the ring — 10x the PCIe dash rate */}
        {Array.from({ length: GRID.rows }, (_, row) => {
          const y = gpuPos(row * GRID.cols).y + GPU.h / 2;
          const x0 = gpuPos(0).x + GPU.w / 2;
          const x1 = gpuPos(GRID.cols - 1).x + GPU.w / 2;

          return (
            <div key={row} style={{ position: "absolute", left: x0, top: y - 10 }}>
              <DataFlow
                color={UV.warning}
                d={`M0 10 L${x1 - x0} 10`}
                dash={[26, 16]}
                glow
                height={20}
                rail={false}
                speed={FLOW_SPEED.nvlink}
                start={linkIn}
                thickness={9}
                width={x1 - x0}
              />
            </div>
          );
        })}

        {/* GPU packages, each carrying its shard */}
        {Array.from({ length: 8 }, (_, i) => {
          const pos = gpuPos(i);
          const appear = at("sxm", 0.06) + i * 4;
          const t = interpolate(frame, [appear, appear + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const shardT = interpolate(frame, [shardIn + i * 5, shardIn + i * 5 + 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: GPU.w,
                height: GPU.h,
                borderRadius: 16,
                backgroundColor: UV.bgSoft,
                border: `3px solid ${UV.border}`,
                opacity: t,
                scale: `${0.82 + t * 0.18}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                overflow: "hidden",
              }}
            >
              {/* the column slice this GPU owns */}
              <div
                style={{
                  width: 176,
                  height: 210,
                  borderRadius: 8,
                  backgroundColor: UV.primaryWash,
                  border: `2.5px solid ${UV.primary}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: UV.primary,
                    transformOrigin: "bottom center",
                    scale: `1 ${shardT}`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontSize: 20,
                    fontWeight: 700,
                    color: shardT > 0.55 ? UV.bg : UV.primary,
                  }}
                >
                  W[:, {i}]
                </div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 18, color: UV.inkSoft }}>
                GPU {i}
              </div>
            </div>
          );
        })}

        {/* Board caption */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            textAlign: "center",
            opacity: interpolate(frame, [at("sxm", 0.14), at("sxm", 0.22)], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ fontFamily: DISPLAY, fontSize: 62, color: UV.ink, letterSpacing: -1.5 }}>
            Baseboard SXM · 8 × H100
          </div>
          <div style={{ fontFamily: MONO, fontSize: 30, color: UV.warningInk, marginTop: 10 }}>
            NVLink {METRICS.nvlinkGbs} GB/s — soit {Math.round(METRICS.nvlinkGbs / METRICS.pcieGbs)}×
            le PCIe · Tensor Parallelism TP={METRICS.tensorParallel}
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 24,
              color: UV.inkSoft,
              marginTop: 8,
              opacity: interpolate(p, [0.6, 0.72], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            chaque token déclenche un all-reduce sur les 8 cartes
          </div>
        </div>
      </div>
    </Zone>
  );
};
