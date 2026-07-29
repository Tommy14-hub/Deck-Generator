import { useCurrentFrame } from "remotion";
import {
  ApiGatewayIcon,
  CockpitIcon,
  DevicesIcon,
  DnsIcon,
  KubernetesIcon,
  RegistryIcon,
} from "../icons";
import type { UvIconProps } from "../icons";
import { COLORS, MONO, SANS, accent, iconTheme } from "../theme";
import type { IconTone } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Stage } from "../ui/Stage";
import { Caption, ChapterHeading } from "../ui/Chrome";
import { Wire } from "../ui/Wire";
import { fadeUp, pop } from "../ui/anim";

type StepProps = {
  readonly icon: React.FC<UvIconProps>;
  readonly name: string;
  readonly desc: string;
  readonly tone: IconTone;
  readonly start: number;
};

const Step: React.FC<StepProps> = ({ icon: Icon, name, desc, tone, start }) => {
  const frame = useCurrentFrame();
  const tint = accent(tone);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <div
        style={{
          width: 116,
          height: 116,
          flexShrink: 0,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.surface,
          border: `1.5px solid ${tint}44`,
          ...pop(frame, start),
        }}
      >
        <div style={iconTheme(tone)}>
          <Icon size={76} />
        </div>
      </div>

      <div style={{ flex: 1, ...fadeUp(frame, start + 6, 16, 16) }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 31,
            fontWeight: 700,
            color: tint,
            letterSpacing: 0.5,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 26,
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

const STEPS: readonly (Omit<StepProps, "start"> & { readonly gap: number })[] = [
  {
    icon: DevicesIcon,
    name: "CLIENT",
    desc: "app TV, mobile, navigateur — des milliers de modèles d'appareils",
    tone: "neutral",
    gap: 54,
  },
  {
    icon: DnsIcon,
    name: "DNS ANYCAST",
    desc: "résout vers la région AWS active la plus proche",
    tone: "cyan",
    gap: 54,
  },
  {
    icon: ApiGatewayIcon,
    name: "ZUUL",
    desc: "API gateway : routage dynamique, retry, rate-limiting",
    tone: "cyan",
    gap: 54,
  },
  {
    icon: RegistryIcon,
    name: "EUREKA",
    desc: "service discovery — registre des instances vivantes",
    tone: "cyan",
    gap: 54,
  },
  {
    icon: KubernetesIcon,
    name: "MICROSERVICES",
    desc: "des centaines de services déployables indépendamment",
    tone: "uv",
    gap: 54,
  },
  {
    icon: CockpitIcon,
    name: "HYSTRIX",
    desc: "circuit breakers : on dégrade le service au lieu de tomber",
    tone: "amber",
    gap: 0,
  },
];

export const S04_ControlPlane: React.FC = () => (
  <Backdrop glow={COLORS.cyan}>
    <ChapterHeading
      accent={COLORS.cyan}
      index="03"
      subtitle="le trajet d'un appui sur « play »"
      title="Control plane"
    />

    <Stage style={{ top: 470, left: 80, right: 80, bottom: 0 }}>
      {STEPS.map((step, i) => (
        <div key={step.name}>
          <Step
            desc={step.desc}
            icon={step.icon}
            name={step.name}
            start={26 + i * 27}
            tone={step.tone}
          />
          {step.gap ? (
            <div style={{ marginLeft: 56, height: step.gap }}>
              <Wire
                color={accent(step.tone)}
                direction="down"
                drawDuration={16}
                length={step.gap}
                packets={2}
                speed={90}
                start={26 + i * 27 + 16}
              />
            </div>
          ) : null}
        </div>
      ))}
    </Stage>

    <Caption start={300}>
      Aucune vidéo ici — seulement des métadonnées.
      <br />
      Le client repart avec une <strong>URL signée</strong> et un manifeste.
    </Caption>
  </Backdrop>
);
