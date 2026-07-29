import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  ApiGatewayIcon,
  CdnIcon,
  KubernetesIcon,
  RdbIcon,
  ServerIcon,
} from "../../deep/icons";
import type { UvIconProps } from "../../deep/icons";
import { C, DISPLAY, MARGIN, MONO, SANS } from "../theme";
import { Highlight } from "../ui/Marks";
import { Headline, Kicker, Paper, rise } from "../ui/Type";

/** The Ultraviolet artwork retinted for a paper background. */
const paperIcon = (accent: string) =>
  ({
    "--uv-weak": "#E6DFCE",
    "--uv-base": C.ink,
    "--uv-strong": accent,
  }) as CSSProperties;

type HalfProps = {
  readonly index: string;
  readonly title: string;
  readonly body: string;
  readonly accent: string;
  readonly icons: readonly React.FC<UvIconProps>[];
  readonly start: number;
};

const Half: React.FC<HalfProps> = ({
  index,
  title,
  body,
  accent,
  icons,
  start,
}) => {
  const frame = useCurrentFrame();
  const t = rise(frame, start, 22);

  return (
    <div
      style={{
        display: "flex",
        gap: 26,
        opacity: t,
        translate: `0px ${(1 - t) * 22}px`,
      }}
    >
      <div
        style={{
          width: 8,
          borderRadius: 4,
          backgroundColor: accent,
          flexShrink: 0,
          transformOrigin: "top center",
          scale: `1 ${rise(frame, start + 4, 24)}`,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
            color: accent,
            marginBottom: 10,
          }}
        >
          {index}
        </div>

        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 62,
            letterSpacing: -1,
            color: C.ink,
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", gap: 14, margin: "22px 0 18px" }}>
          {icons.map((Icon, i) => (
            <div
              key={Icon.name}
              style={{
                ...paperIcon(accent),
                opacity: rise(frame, start + 14 + i * 6, 14),
              }}
            >
              <Icon size={78} />
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.35,
            color: C.inkSoft,
            opacity: rise(frame, start + 24, 16),
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
};

export const V04_Split: React.FC = () => (
  <Paper>
    <AbsoluteFill
      style={{
        paddingLeft: MARGIN,
        paddingRight: MARGIN,
        justifyContent: "center",
        gap: 60,
      }}
    >
      <Kicker start={4}>L&apos;idée</Kicker>

      <Headline
        lines={[
          "Netflix a coupé",
          "son infrastructure",
          <>
            en <Highlight start={72}>deux</Highlight>.
          </>,
        ]}
        size={82}
        start={12}
      />

      <Half
        accent={C.blue}
        body="Les comptes, la recherche, les recommandations, la facturation. Ça, c'est du calcul — et ça tourne sur AWS."
        icons={[ApiGatewayIcon, KubernetesIcon, RdbIcon]}
        index="01 — LE CERVEAU"
        start={112}
        title="Tout sauf la vidéo"
      />

      <Half
        accent={C.red}
        body="Les octets du film. Ils ne passent jamais par AWS : Netflix a bâti son propre réseau pour eux."
        icons={[CdnIcon, ServerIcon]}
        index="02 — LES OCTETS"
        start={210}
        title="La vidéo, et rien d'autre"
      />
    </AbsoluteFill>
  </Paper>
);
