import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const DISPLAY = "Archivo Black";
export const SANS = "Inter";
export const MONO = "JetBrains Mono";

loadFont({ family: DISPLAY, url: staticFile("fonts/ArchivoBlack.woff2"), weight: "400" });
loadFont({ family: SANS, url: staticFile("fonts/Inter.woff2"), weight: "100 900" });
loadFont({ family: MONO, url: staticFile("fonts/JetBrainsMono.woff2"), weight: "100 800" });

/**
 * Editorial palette: warm paper, near-black ink, and a highlighter yellow —
 * the Vox explainer look. Netflix red appears only as the subject's own colour.
 */
export const C = {
  paper: "#F2EEE4",
  ink: "#14110E",
  inkSoft: "#6F675C",
  rule: "#D8D1C2",
  yellow: "#FFE01A",
  red: "#E50914",
  blue: "#2B6CF6",
  white: "#FFFFFF",
} as const;

export const FPS = 30;
/** 1080x1920 canvas. Editorial margins are wide — text never runs full bleed. */
export const MARGIN = 92;
