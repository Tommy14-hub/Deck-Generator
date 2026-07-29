import type { CSSProperties } from "react";
import { CANVAS, UV } from "../design/theme";

/**
 * The 5000x5000 plane every subject is pinned to.
 *
 * The grid is drawn at two densities so that zooming in reveals finer
 * subdivision instead of stretching a single scale — it gives the eye a
 * reference for how far the camera has travelled and how deep it has zoomed.
 */
export const InfiniteCanvas: React.FC<{
  readonly children: React.ReactNode;
  readonly grid?: boolean;
}> = ({ children, grid = true }) => (
  <div
    style={{
      position: "relative",
      width: CANVAS.w,
      height: CANVAS.h,
      backgroundColor: UV.bgSoft,
    }}
  >
    {grid ? (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            `linear-gradient(${UV.borderSoft} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${UV.borderSoft} 1px, transparent 1px)`,
            `linear-gradient(${UV.bgStrong} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${UV.bgStrong} 1px, transparent 1px)`,
          ].join(","),
          backgroundSize: "40px 40px, 40px 40px, 400px 400px, 400px 400px",
        }}
      />
    ) : null}
    {children}
  </div>
);

/**
 * Places a subject at a world coordinate, centred on that point.
 * Everything in `zones/` mounts through this so the scenario's ZONES map stays
 * the only place coordinates are written down.
 */
export const Zone: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly style?: CSSProperties;
}> = ({ x, y, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      ...style,
    }}
  >
    {children}
  </div>
);
