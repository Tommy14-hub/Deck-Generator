export const DISPLAY = "Archivo Black";
export const SANS = "Inter";
export const MONO = "JetBrains Mono";

/**
 * Faces are declared in src/fonts.css as base64 data URIs, imported by Root.
 * Nothing is fetched at render time, so no font can hold a delayRender handle
 * open — see scripts/build-fonts.ts for why that mattered.
 */

/**
 * Scaleway Ultraviolet — console *light* theme.
 * Values lifted from packages/themes/src/themes/console/light so the film sits
 * in the same palette as the product it illustrates.
 */
export const UV = {
  // Surfaces
  bg: "#FFFFFF",
  bgSoft: "#F9F9FA",
  bgStrong: "#E9EAEB",
  border: "#D9DADD",
  borderSoft: "#E9E9EC",

  // Ink
  ink: "#151A2D",
  inkSoft: "#484B5A",
  inkFaint: "#B5B7BD",

  // Primary — Scaleway violet
  primary: "#792DD4",
  primaryBright: "#8D40EE",
  primaryDeep: "#3D1862",
  primaryWash: "#F1EEFC",

  // Semantic
  info: "#0078D2",
  infoWash: "#E0F2FF",
  success: "#2C8564",
  successWash: "#DAF6EC",
  warning: "#FBC600",
  warningInk: "#7C5400",
  danger: "#E51963",
  dangerWash: "#FFEBF2",

  // Reserved for the KV cache, which the brief calls out in cyan
  cyan: "#00A5C8",
  cyanWash: "#E0F7FC",
} as const;

/** The world the camera flies over. Everything is positioned in these coords. */
export const CANVAS = { w: 5000, h: 5000 } as const;

/** Output frame. Vertical, to match the rest of the series. */
export const FRAME = { w: 1080, h: 1920 } as const;
