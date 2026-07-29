import { useCurrentFrame } from "remotion";
import {
  ApiGatewayIcon,
  BandwidthIcon,
  CdnIcon,
  EdgeServicesIcon,
  IamIcon,
  KubernetesIcon,
  RdbIcon,
  ServerIcon,
} from "../icons";
import type { UvIconProps } from "../icons";
import { COLORS, MONO, SANS } from "../theme";
import type { IconTone } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Stage } from "../ui/Stage";
import { Caption, ChapterHeading } from "../ui/Chrome";
import { InfraNode } from "../ui/Node";
import { fadeUp } from "../ui/anim";

type PlaneProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly color: string;
  readonly tone: IconTone;
  readonly footer: string;
  readonly start: number;
  readonly nodes: readonly {
    readonly icon: React.FC<UvIconProps>;
    readonly label: string;
  }[];
};

const Plane: React.FC<PlaneProps> = ({
  title,
  subtitle,
  color,
  tone,
  footer,
  start,
  nodes,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        flex: 1,
        // Without this a long monospace label sets the flex base and overflows.
        minWidth: 0,
        borderRadius: 24,
        border: `1.5px solid ${color}44`,
        backgroundColor: `${color}0A`,
        padding: "30px 24px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        ...fadeUp(frame, start, 26),
      }}
    >
      <div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 34,
            fontWeight: 700,
            color,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 21,
            color: COLORS.textDim,
            marginTop: 6,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          justifyItems: "center",
          rowGap: 22,
        }}
      >
        {nodes.map((node, i) => (
          <InfraNode
            icon={node.icon}
            key={node.label}
            label={node.label}
            size={72}
            start={start + 14 + i * 8}
            tone={tone}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 18,
          borderTop: `1px solid ${color}33`,
          fontFamily: MONO,
          fontSize: 22,
          color,
          textAlign: "center",
          ...fadeUp(frame, start + 48, 12, 14),
        }}
      >
        {footer}
      </div>
    </div>
  );
};

export const S03_TwoPlanes: React.FC = () => (
  <Backdrop glow={COLORS.cyan}>
    <ChapterHeading
      accent={COLORS.cyan}
      index="02"
      subtitle="deux infrastructures, deux métiers"
      title="Séparer le cerveau des octets"
    />

    <Stage
      style={{
        top: 510,
        left: 80,
        right: 80,
        bottom: 0,
        display: "flex",
        // AbsoluteFill defaults to a column, so the row direction is explicit.
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 28,
      }}
    >
      <Plane
        color={COLORS.cyan}
        footer="tout SAUF la vidéo"
        nodes={[
          { icon: ApiGatewayIcon, label: "API gateway" },
          { icon: KubernetesIcon, label: "microservices" },
          { icon: RdbIcon, label: "bases" },
          { icon: IamIcon, label: "auth / DRM" },
        ]}
        start={26}
        subtitle="AWS · multi-régions"
        title="CONTROL PLANE"
        tone="cyan"
      />
      <Plane
        color={COLORS.green}
        footer="UNIQUEMENT la vidéo"
        nodes={[
          { icon: CdnIcon, label: "CDN" },
          { icon: ServerIcon, label: "OCA" },
          { icon: EdgeServicesIcon, label: "edge FAI" },
          { icon: BandwidthIcon, label: "débit" },
        ]}
        start={54}
        subtitle="Open Connect"
        title="DATA PLANE"
        tone="green"
      />
    </Stage>

    <Caption start={150}>
      Le catalogue, la recherche et la reco tournent sur AWS.
      <br />
      Les octets vidéo, eux, ne transitent{" "}
      <strong style={{ color: COLORS.green }}>jamais</strong> par AWS.
    </Caption>
  </Backdrop>
);
