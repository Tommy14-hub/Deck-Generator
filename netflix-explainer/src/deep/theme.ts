import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Fonts ship with the project rather than being pulled from Google at render
 * time — the render browser has no outbound network, and self-hosting keeps
 * output byte-identical across machines. Both files are variable fonts, so a
 * single face covers the whole weight range.
 */
export const SANS = "Inter";
export const MONO = "JetBrains Mono";

loadFont({
  family: SANS,
  url: staticFile("fonts/Inter.woff2"),
  weight: "100 900",
});

loadFont({
  family: MONO,
  url: staticFile("fonts/JetBrainsMono.woff2"),
  weight: "100 800",
});

export const COLORS = {
  bg: "#08080A",
  surface: "rgba(255, 255, 255, 0.035)",
  border: "rgba(255, 255, 255, 0.10)",
  grid: "rgba(255, 255, 255, 0.045)",
  text: "#F5F5F7",
  textDim: "#8B8B95",
  netflix: "#E50914",
  uv: "#A365F6",
  cyan: "#4FD1FF",
  green: "#3DDC97",
  amber: "#FFB020",
} as const;

/**
 * The extracted Ultraviolet icons paint themselves from these custom properties,
 * so a scene can restyle the same artwork by wrapping it in a themed container.
 */
export type IconTone = "neutral" | "netflix" | "uv" | "cyan" | "green" | "amber";

const TONE_ACCENT: Record<IconTone, string> = {
  neutral: COLORS.uv,
  netflix: COLORS.netflix,
  uv: COLORS.uv,
  cyan: COLORS.cyan,
  green: COLORS.green,
  amber: COLORS.amber,
};

const TONE_PLATE: Record<IconTone, string> = {
  neutral: "rgba(255, 255, 255, 0.07)",
  netflix: "rgba(229, 9, 20, 0.14)",
  uv: "rgba(163, 101, 246, 0.14)",
  cyan: "rgba(79, 209, 255, 0.13)",
  green: "rgba(61, 220, 151, 0.13)",
  amber: "rgba(255, 176, 32, 0.13)",
};

export const iconTheme = (tone: IconTone) =>
  ({
    "--uv-weak": TONE_PLATE[tone],
    "--uv-base": COLORS.text,
    "--uv-strong": TONE_ACCENT[tone],
  }) as React.CSSProperties;

export const accent = (tone: IconTone) => TONE_ACCENT[tone];

/** 1080x1920 canvas — keep meaningful content inside these bounds. */
export const SAFE_X = 80;
export const FPS = 30;
