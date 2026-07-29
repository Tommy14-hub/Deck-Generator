import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { CAMERA_PATH, DURATION } from "../config/scenario";
import type { CameraKey } from "../config/scenario";
import { FRAME } from "../design/theme";

export type CameraState = { readonly x: number; readonly y: number; readonly zoom: number };

const CameraContext = createContext<CameraState>({ x: 0, y: 0, zoom: 1 });

/** Current camera state, for parallax layers and anything that reacts to zoom. */
export const useCamera = (): CameraState => useContext(CameraContext);

/**
 * Catmull-Rom through four control points.
 *
 * Why not `interpolate` with an easing? Easing each segment brings velocity to
 * zero at every keyframe, which is exactly the "camera parks on the subject"
 * effect the brief rules out. A Catmull-Rom spline passes *through* every key
 * while keeping velocity continuous across them, so the move never stops — it
 * only changes direction.
 */
const catmullRom = (p0: number, p1: number, p2: number, p3: number, u: number): number => {
  const u2 = u * u;
  const u3 = u2 * u;

  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
};

const clampIndex = (i: number, len: number) => Math.max(0, Math.min(len - 1, i));

/** Samples the flight path at a normalised time, 0→1. */
export const sampleCamera = (t: number, path: readonly CameraKey[] = CAMERA_PATH): CameraState => {
  const clamped = Math.max(0, Math.min(1, t));

  let i = 0;
  while (i < path.length - 2 && clamped >= path[i + 1].at) i++;

  const k1 = path[i];
  const k2 = path[clampIndex(i + 1, path.length)];
  const span = k2.at - k1.at;
  // Non-uniform key spacing: normalise by the real gap so velocity stays even.
  const u = span <= 0 ? 0 : (clamped - k1.at) / span;

  const k0 = path[clampIndex(i - 1, path.length)];
  const k3 = path[clampIndex(i + 2, path.length)];

  return {
    x: catmullRom(k0.x, k1.x, k2.x, k3.x, u),
    y: catmullRom(k0.y, k1.y, k2.y, k3.y, u),
    zoom: catmullRom(k0.zoom, k1.zoom, k2.zoom, k3.zoom, u),
  };
};

/**
 * Viewport. Applies `translate(...) scale(...)` so that the world point the
 * camera is looking at lands in the centre of the frame.
 */
export const CameraController: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const base = sampleCamera(frame / DURATION);

  // A breath of drift so the frame is never perfectly static, even on a hold.
  const cam: CameraState = {
    x: base.x + Math.sin(frame / 97) * 14,
    y: base.y + Math.cos(frame / 83) * 11,
    zoom: base.zoom * (1 + Math.sin(frame / 131) * 0.006),
  };

  const tx = FRAME.w / 2 - cam.x * cam.zoom;
  const ty = FRAME.h / 2 - cam.y * cam.zoom;

  return (
    <CameraContext.Provider value={cam}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "0 0",
            transform: `translate(${tx}px, ${ty}px) scale(${cam.zoom})`,
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>
    </CameraContext.Provider>
  );
};
