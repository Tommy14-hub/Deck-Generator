import { COLORS } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Stage } from "../ui/Stage";
import { Caption, ChapterHeading } from "../ui/Chrome";
import { Metric, Terminal } from "../ui/Data";

export const S02_Scale: React.FC = () => (
  <Backdrop glow={COLORS.netflix}>
    <ChapterHeading
      accent={COLORS.netflix}
      index="01"
      subtitle="pourquoi un seul datacenter ne suffit pas"
      title="Le mur de l'échelle"
    />

    <Stage
      style={{
        top: 470,
        left: 80,
        right: 80,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 56,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Metric
          color={COLORS.netflix}
          format={(n) => `~${Math.round(n)}`}
          label={"millions\nd'abonnés"}
          start={26}
          unit=" M"
          value={300}
        />
        <Metric
          color={COLORS.cyan}
          format={(n) => `${Math.round(n)}`}
          label={"pays\ndesservis"}
          start={38}
          unit="+"
          value={190}
        />
        <Metric
          color={COLORS.uv}
          format={(n) => `~${Math.round(n)}`}
          label={"du trafic Internet\ndescendant mondial"}
          start={50}
          unit=" %"
          value={15}
        />
      </div>

      <Terminal
        lines={[
          { text: "$ estimation du pic de charge", color: COLORS.textDim },
          {
            text: "→ des dizaines de Tbit/s simultanés",
            color: COLORS.text,
          },
          {
            text: "→ latence de démarrage cible : < 1 s",
            color: COLORS.text,
          },
          {
            text: "✗ impossible depuis un point unique",
            color: COLORS.netflix,
          },
        ]}
        start={80}
        stagger={26}
      />
    </Stage>

    <Caption start={186}>
      La réponse de Netflix : séparer le <strong>cerveau</strong> des{" "}
      <strong>octets</strong>.
    </Caption>
  </Backdrop>
);
