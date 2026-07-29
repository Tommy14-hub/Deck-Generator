import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AuditTrailIcon, DdosIcon, ZoneIcon } from "../icons";
import type { UvIconProps } from "../icons";
import { NetflixLogo } from "../NetflixLogo";
import { COLORS, MONO, SANS, accent, iconTheme } from "../theme";
import type { IconTone } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Stage } from "../ui/Stage";
import { ChapterHeading } from "../ui/Chrome";
import { fadeUp, flash, pop, ramp } from "../ui/anim";

const CARDS: readonly {
  readonly icon: React.FC<UvIconProps>;
  readonly title: string;
  readonly desc: string;
  readonly tone: IconTone;
}[] = [
  {
    icon: DdosIcon,
    title: "Chaos Monkey",
    desc: "des instances sont tuées au hasard, en production",
    tone: "netflix",
  },
  {
    icon: ZoneIcon,
    title: "Multi-région actif/actif",
    desc: "une région entière peut être évacuée en minutes",
    tone: "cyan",
  },
  {
    icon: AuditTrailIcon,
    title: "Dégradation gracieuse",
    desc: "sans reco, l'app sert une liste par défaut — mais elle sert",
    tone: "green",
  },
];

const Card: React.FC<(typeof CARDS)[number] & { readonly start: number }> = ({
  icon: Icon,
  title,
  desc,
  tone,
  start,
}) => {
  const frame = useCurrentFrame();
  const tint = accent(tone);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "24px 28px",
        borderRadius: 20,
        border: `1.5px solid ${tint}33`,
        backgroundColor: `${tint}0A`,
        ...fadeUp(frame, start, 24),
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          flexShrink: 0,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.surface,
          ...pop(frame, start + 4),
        }}
      >
        <div style={iconTheme(tone)}>
          <Icon size={64} />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 30,
            fontWeight: 700,
            color: tint,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 25,
            color: COLORS.textDim,
            marginTop: 7,
            lineHeight: 1.3,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

export const S09_Resilience: React.FC = () => {
  const frame = useCurrentFrame();

  // The chapter hands over to the sign-off around frame 165.
  const chapterOpacity = flash(frame, 0, 150, 18);
  const outro = ramp(frame, 176, 26);

  return (
    <Backdrop glow={COLORS.netflix}>
      <AbsoluteFill style={{ opacity: chapterOpacity }}>
        <ChapterHeading
          accent={COLORS.netflix}
          index="08"
          subtitle="on ne prévient pas la panne, on s'y entraîne"
          title="Résilience"
        />

        <Stage
          style={{
            top: 540,
            left: 80,
            right: 80,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          {CARDS.map((card, i) => (
            <Card
              desc={card.desc}
              icon={card.icon}
              key={card.title}
              start={24 + i * 22}
              title={card.title}
              tone={card.tone}
            />
          ))}
        </Stage>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
          opacity: outro,
        }}
      >
        <NetflixLogo progress={1} width={620} />

        <div
          style={{
            fontFamily: SANS,
            fontSize: 54,
            fontWeight: 700,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 880,
            ...fadeUp(frame, 190, 24),
          }}
        >
          L&apos;infrastructure n&apos;est pas derrière le produit.
          <br />
          Elle <span style={{ color: COLORS.netflix }}>est</span> le produit.
        </div>

        <div
          style={{
            marginTop: 30,
            fontFamily: MONO,
            fontSize: 23,
            color: COLORS.textDim,
            textAlign: "center",
            lineHeight: 1.6,
            ...fadeUp(frame, 210, 18),
          }}
        >
          icônes d&apos;infrastructure : Scaleway Ultraviolet
          <br />
          animation : Remotion
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
