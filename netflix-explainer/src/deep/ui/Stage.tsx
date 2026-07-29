import type { CSSProperties } from "react";

type Props = {
  readonly children: React.ReactNode;
  readonly style?: CSSProperties;
};

/**
 * Inset content area.
 *
 * Deliberately not `<AbsoluteFill>`: that component also sets `width: 100%`
 * and `height: 100%`, which survive a style override and make an element with
 * `left: 80` render 1080px wide starting at x=80 — i.e. 160px off-frame. A
 * plain positioned box derives its size from the offsets, which is what a
 * padded content column needs.
 */
export const Stage: React.FC<Props> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    {children}
  </div>
);
