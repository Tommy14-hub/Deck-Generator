import { interpolate, useCurrentFrame } from "remotion";
import { DataFlow } from "../components/DataFlow";
import { Zone } from "../camera/InfiniteCanvas";
import { METRICS, ZONES, at, stageProgress } from "../config/scenario";
import { DISPLAY, MONO, UV } from "../design/theme";

const COLS = 22;
const ROWS = 14;
const PAGES = COLS * ROWS;

/** Four concurrent sequences, each with its own ink. */
const SEQ_COLORS = [UV.cyan, UV.primary, UV.success, UV.danger];

/**
 * Deterministic scatter of page indices.
 *
 * The whole point of PagedAttention is that a sequence's KV pages need *not*
 * be contiguous: the allocator hands out whatever is free, and an index maps
 * logical position to physical page. Shuffling with a fixed LCG makes that
 * visible — blocks of one colour land all over the grid instead of in a run.
 */
const SCATTER = (() => {
  const order = Array.from({ length: PAGES }, (_, i) => i);
  let seed = 987654321;

  for (let i = order.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }

  return order;
})();

export const PagedAttention: React.FC = () => {
  const frame = useCurrentFrame();
  const p = stageProgress(frame, "inference");

  // Requests join the running batch one after another (continuous batching).
  const admitted = Math.min(4, Math.floor(interpolate(p, [0.08, 0.5], [0, 4.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));

  const allocated = Math.floor(
    interpolate(p, [0.15, 0.92], [0, PAGES * 0.62], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <>
      {/* Incoming requests */}
      <Zone x={ZONES.requests.x} y={ZONES.requests.y}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SEQ_COLORS.map((color, i) => {
              const appear = at("inference", 0.08) + i * 16;
              const t = interpolate(frame, [appear, appear + 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={color}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 20px",
                    borderRadius: 10,
                    backgroundColor: UV.bg,
                    border: `2.5px solid ${i < admitted ? color : UV.border}`,
                    opacity: t,
                    translate: `${(1 - t) * -40}px 0px`,
                    minWidth: 330,
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 12,
                      backgroundColor: i < admitted ? color : UV.inkFaint,
                    }}
                  />
                  <span style={{ fontFamily: MONO, fontSize: 21, color: UV.ink }}>
                    seq-{i} · prompt
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: MONO,
                      fontSize: 18,
                      color: i < admitted ? color : UV.inkFaint,
                    }}
                  >
                    {i < admitted ? "running" : "queued"}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 22, color: UV.inkSoft }}>
            continuous batching
          </div>
        </div>
      </Zone>

      {/* Requests → page allocator */}
      <Zone x={ZONES.requests.x + 250} y={ZONES.requests.y + 220}>
        <DataFlow
          color={UV.cyan}
          d="M0 0 C 120 60, 40 190, 190 240"
          dash={[14, 18]}
          height={260}
          speed={9}
          start={at("inference", 0.16)}
          thickness={7}
          width={220}
        />
      </Zone>

      {/* The page table */}
      <Zone x={ZONES.kvCache.x} y={ZONES.kvCache.y}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gap: 5,
              width: 760,
              padding: 20,
              borderRadius: 16,
              backgroundColor: UV.bg,
              border: `3px solid ${UV.border}`,
            }}
          >
            {Array.from({ length: PAGES }, (_, cell) => {
              // Which allocation step claimed this physical page, if any.
              const rank = SCATTER.indexOf(cell);
              const claimed = rank < allocated;
              const seq = rank % SEQ_COLORS.length;
              const justClaimed = claimed && rank > allocated - 6;

              return (
                <div
                  key={cell}
                  style={{
                    height: 22,
                    borderRadius: 3,
                    backgroundColor: claimed ? SEQ_COLORS[seq] : UV.bgStrong,
                    opacity: claimed ? (justClaimed ? 1 : 0.82) : 1,
                    scale: justClaimed ? "1.18" : "1",
                  }}
                />
              );
            })}
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 54, color: UV.ink, letterSpacing: -1.5 }}>
              PagedAttention
            </div>
            <div style={{ fontFamily: MONO, fontSize: 26, color: UV.cyan, marginTop: 10 }}>
              KV cache paginé · {METRICS.kvBlockTokens} tokens par bloc
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 22,
                color: UV.inkSoft,
                marginTop: 10,
                opacity: interpolate(p, [0.55, 0.68], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              les pages d&apos;une même séquence ne sont pas contiguës —
              <br />
              plus de fragmentation, plus de réservation à vide
            </div>
          </div>
        </div>
      </Zone>
    </>
  );
};
