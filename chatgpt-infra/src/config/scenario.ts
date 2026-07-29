/**
 * Single source of truth for the film's timing and geography.
 *
 * The brief is internally inconsistent about length: the header asks for 60 s
 * (1800 frames) while the storyboard lists four 30 s stages and "3600 frames".
 * Nothing here hardcodes a frame number — stages are declared as *weights* and
 * camera keys as *normalised* positions, so flipping DURATION between the two
 * rescales the whole film (camera moves, metric ramps, flow speeds) coherently.
 */
export const FPS = 30;

/** 3600 = 120 s — the four 30 s stages the storyboard describes. */
export const DURATION = 3600;

export type StageId = "boot" | "pcie" | "sxm" | "inference";

type Stage = {
  readonly id: StageId;
  readonly label: string;
  /** Relative share of the runtime. The brief gives all four equal time. */
  readonly weight: number;
};

export const STAGES: readonly Stage[] = [
  { id: "boot", label: "Chargement des poids", weight: 1 },
  { id: "pcie", label: "Transfert PCIe → VRAM", weight: 1 },
  { id: "sxm", label: "Cluster SXM · NVLink", weight: 1 },
  { id: "inference", label: "Inférence · PagedAttention", weight: 1 },
];

const TOTAL_WEIGHT = STAGES.reduce((sum, s) => sum + s.weight, 0);

export type Range = { readonly start: number; readonly end: number; readonly length: number };

/** Frame window of each stage, derived from the weights. */
export const STAGE_RANGES: Record<StageId, Range> = (() => {
  const out = {} as Record<StageId, Range>;
  let cursor = 0;

  for (const stage of STAGES) {
    const length = Math.round((stage.weight / TOTAL_WEIGHT) * DURATION);
    out[stage.id] = { start: cursor, end: cursor + length, length };
    cursor += length;
  }

  return out;
})();

/**
 * 0→1 progress through a stage. Metrics animate against this rather than raw
 * frames, so a 140 GB download fills at the same visual rate at any DURATION.
 */
export const stageProgress = (frame: number, id: StageId): number => {
  const { start, length } = STAGE_RANGES[id];

  return Math.max(0, Math.min(1, (frame - start) / length));
};

/** Absolute frame for a point inside a stage, e.g. `at("pcie", 0.25)`. */
export const at = (id: StageId, t: number): number =>
  STAGE_RANGES[id].start + t * STAGE_RANGES[id].length;

/**
 * Where each subject lives on the 5000x5000 plane. The camera never cuts, so
 * the layout doubles as the edit: the route between these points *is* the film.
 */
export const ZONES = {
  objectStorage: { x: 1000, y: 700 },
  nvme: { x: 1000, y: 1950 },
  systemRam: { x: 2350, y: 2050 },
  pcieBus: { x: 2900, y: 2250 },
  gpuDie: { x: 3550, y: 2450 },
  vramMap: { x: 3550, y: 3050 },
  sxmBoard: { x: 2500, y: 3650 },
  nvlink: { x: 2500, y: 3650 },
  requests: { x: 3900, y: 4250 },
  kvCache: { x: 4200, y: 4450 },
} as const;

export type CameraKey = {
  /** Normalised position in the film, 0→1. Scales with DURATION. */
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
};

/**
 * The flight path. Keys are deliberately denser than the four stages: each
 * subject gets an approach, a settle and a departure so the camera is always
 * carrying momentum into the next move instead of parking on a subject.
 */
export const CAMERA_PATH: readonly CameraKey[] = [
  { at: 0.0, x: ZONES.objectStorage.x, y: ZONES.objectStorage.y - 420, zoom: 0.42 },
  { at: 0.05, x: ZONES.objectStorage.x, y: ZONES.objectStorage.y, zoom: 0.92 },
  { at: 0.15, x: ZONES.objectStorage.x, y: ZONES.objectStorage.y + 620, zoom: 0.8 },
  { at: 0.23, x: ZONES.nvme.x, y: ZONES.nvme.y, zoom: 0.95 },

  { at: 0.3, x: ZONES.systemRam.x, y: ZONES.systemRam.y, zoom: 0.72 },
  { at: 0.38, x: ZONES.pcieBus.x, y: ZONES.pcieBus.y, zoom: 1.05 },
  { at: 0.46, x: ZONES.gpuDie.x, y: ZONES.gpuDie.y, zoom: 1.4 },
  { at: 0.54, x: ZONES.vramMap.x, y: ZONES.vramMap.y, zoom: 1.0 },

  { at: 0.62, x: ZONES.sxmBoard.x, y: ZONES.sxmBoard.y, zoom: 0.44 },
  { at: 0.72, x: ZONES.nvlink.x, y: ZONES.nvlink.y, zoom: 0.86 },

  { at: 0.82, x: ZONES.requests.x, y: ZONES.requests.y, zoom: 0.66 },
  { at: 0.92, x: ZONES.kvCache.x, y: ZONES.kvCache.y, zoom: 1.25 },
  { at: 1.0, x: ZONES.kvCache.x + 160, y: ZONES.kvCache.y - 120, zoom: 1.05 },
];

/**
 * Metric targets called out in the brief. Kept as data so the HUD, the flow
 * speeds and the VRAM blocks all read from the same numbers.
 */
export const METRICS = {
  weightsGb: 140,
  cpuIdlePct: 2,
  cpuDecodePct: 80,
  systemRamGb: 150,
  pcieGbs: 64,
  vramWeightsGb: 35,
  vramOverheadGb: 5,
  nvlinkGbs: 900,
  tensorParallel: 8,
  kvBlockMb: 500,
  kvBlockTokens: 16,
  ttftMs: 400,
  throughputTokensPerSec: 2500,
} as const;

/** NVLink must read ~10x the PCIe flow. Dash animation speeds, px/frame. */
export const FLOW_SPEED = { pcie: 3.2, nvlink: 32 } as const;
