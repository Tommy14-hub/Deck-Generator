import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import { C } from "../theme";
import { WORLD_HEIGHT, WORLD_PATHS, WORLD_WIDTH } from "../worldPaths";

/** Equirectangular, matching the projection baked into worldPaths.ts. */
const project = (lon: number, lat: number): [number, number] => [
  ((lon + 180) / 360) * WORLD_WIDTH,
  ((90 - lat) / 180) * WORLD_HEIGHT,
];

/**
 * Representative metros where Netflix peers or embeds Open Connect appliances.
 * Ordered so the reveal sweeps Europe → Americas → Africa/Asia → Oceania.
 */
const SITES: readonly [number, number][] = [
  [2.35, 48.86], [-0.13, 51.51], [8.68, 50.11], [-3.7, 40.42], [18.07, 59.33],
  [9.19, 45.46], [-9.14, 38.72], [-6.26, 53.35], [10.75, 59.91], [24.94, 60.17],
  [16.37, 48.21], [21.01, 52.23], [23.73, 37.98], [28.98, 41.01], [37.62, 55.76],
  [-74.01, 40.71], [-118.24, 34.05], [-87.63, 41.88], [-80.19, 25.76],
  [-79.38, 43.65], [-123.12, 49.28], [-122.33, 47.61], [-96.8, 32.78],
  [-104.99, 39.74], [-84.39, 33.75], [-99.13, 19.43], [-74.07, 4.71],
  [-77.04, -12.05], [-70.67, -33.45], [-46.63, -23.55], [-58.38, -34.6],
  [-7.59, 33.57], [3.38, 6.52], [31.24, 30.04], [36.82, -1.29], [28.04, -26.2],
  [55.27, 25.2], [72.87, 19.08], [77.21, 28.61], [103.82, 1.35],
  [100.5, 13.76], [106.85, -6.21], [114.17, 22.32], [139.69, 35.69],
  [126.98, 37.57], [151.21, -33.87], [144.96, -37.81], [174.76, -36.85],
];

/** Frames between consecutive site reveals. */
const CADENCE = 2.2;

export const SITE_COUNT = SITES.length;

/** How many sites have lit up by this frame — lets a scene tick a counter. */
export const litSites = (frame: number, start: number): number =>
  Math.max(0, Math.min(SITE_COUNT, Math.floor((frame - start) / CADENCE)));

type Props = {
  readonly start?: number;
  readonly style?: CSSProperties;
  readonly landColor?: string;
  readonly dotColor?: string;
};

export const WorldMap: React.FC<Props> = ({
  start = 0,
  style,
  landColor = "#DCD5C6",
  dotColor = C.red,
}) => {
  const frame = useCurrentFrame();

  return (
    <svg
      style={{ width: "100%", display: "block", ...style }}
      viewBox={`0 30 ${WORLD_WIDTH} 400`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {WORLD_PATHS.map((d) => (
          <path d={d} fill={landColor} key={d.slice(0, 24)} />
        ))}
      </g>

      {SITES.map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        const at = start + i * CADENCE;
        const pop = interpolate(frame, [at, at + 9], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.4, 0.4, 1),
        });
        // A short halo flares as each site comes online, then settles.
        const halo = interpolate(frame, [at, at + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <g key={`${lon},${lat}`}>
            <circle
              cx={x}
              cy={y}
              fill={dotColor}
              opacity={(1 - halo) * 0.5}
              r={4 + halo * 14}
            />
            <circle cx={x} cy={y} fill={dotColor} r={4.2 * pop} />
          </g>
        );
      })}
    </svg>
  );
};
