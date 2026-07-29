import { ObjectStorageIcon, RdbIcon, RedisIcon } from "../icons";
import { COLORS, MONO } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Stage } from "../ui/Stage";
import { Caption, ChapterHeading } from "../ui/Chrome";
import { BarMeter } from "../ui/Data";
import { InfraNode } from "../ui/Node";

export const S05_DataLayer: React.FC = () => (
  <Backdrop glow={COLORS.uv}>
    <ChapterHeading
      accent={COLORS.uv}
      index="04"
      subtitle="une hiérarchie de caches, pas une base unique"
      title="La couche données"
    />

    <Stage
      style={{
        top: 520,
        left: 80,
        right: 80,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        gap: 70,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <InfraNode
          icon={RedisIcon}
          label="EVCache"
          live
          size={104}
          start={26}
          sublabel="memcached"
          tone="green"
        />
        <InfraNode
          icon={RdbIcon}
          label="Cassandra"
          size={104}
          start={40}
          sublabel="multi-région"
          tone="uv"
        />
        <InfraNode
          icon={ObjectStorageIcon}
          label="S3"
          size={104}
          start={54}
          sublabel="stockage objet"
          tone="cyan"
        />
      </div>

      <div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            color: COLORS.textDim,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          budget de latence par étage
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <BarMeter
            color={COLORS.green}
            fill={0.06}
            highlight
            label="EVCache"
            start={90}
            value="< 1 ms"
          />
          <BarMeter
            color={COLORS.uv}
            fill={0.28}
            label="Cassandra"
            start={106}
            value="~ 10 ms"
          />
          <BarMeter
            color={COLORS.cyan}
            fill={0.92}
            label="S3 / disque"
            start={122}
            value="~ 100 ms"
          />
        </div>
      </div>
    </Stage>

    <Caption start={190}>
      La donnée chaude ne descend{" "}
      <strong style={{ color: COLORS.green }}>jamais</strong> jusqu&apos;au
      disque : le cache absorbe l&apos;écrasante majorité des lectures.
    </Caption>
  </Backdrop>
);
