import { Fragment } from "react";
import {
  ComputeOptimizedInstancesIcon,
  DistributedDataLabIcon,
  ObjectStorageIcon,
  VideoIcon,
} from "../icons";
import { COLORS, MONO } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Stage } from "../ui/Stage";
import { Caption, ChapterHeading } from "../ui/Chrome";
import { BarMeter } from "../ui/Data";
import { InfraNode } from "../ui/Node";
import { Wire } from "../ui/Wire";

const STAGES = [
  {
    icon: VideoIcon,
    label: "MEZZANINE",
    sublabel: "master source",
    tone: "netflix",
  },
  {
    icon: DistributedDataLabIcon,
    label: "DÉCOUPAGE",
    sublabel: "par plan",
    tone: "uv",
  },
  {
    icon: ComputeOptimizedInstancesIcon,
    label: "ENCODAGE",
    sublabel: "× milliers",
    tone: "cyan",
  },
  {
    icon: ObjectStorageIcon,
    label: "PACKAGING",
    sublabel: "DASH + DRM",
    tone: "green",
  },
] as const;

export const S06_Encoding: React.FC = () => (
  <Backdrop glow={COLORS.uv}>
    <ChapterHeading
      accent={COLORS.uv}
      index="05"
      subtitle="un film n'est pas encodé une fois, mais des centaines"
      title="Le pipeline d'encodage"
    />

    <Stage
      style={{
        top: 500,
        left: 80,
        right: 80,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        gap: 76,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {STAGES.map((stage, i) => (
          <Fragment key={stage.label}>
            <InfraNode
              icon={stage.icon}
              label={stage.label}
              live={i === 2}
              size={64}
              start={26 + i * 20}
              sublabel={stage.sublabel}
              tone={stage.tone}
            />
            {i < STAGES.length - 1 ? (
              <div style={{ marginTop: 50 }}>
                <Wire
                  color={COLORS.uv}
                  direction="right"
                  drawDuration={14}
                  length={44}
                  packets={2}
                  speed={70}
                  start={26 + i * 20 + 14}
                />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>

      <div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            color: COLORS.textDim,
            marginBottom: 26,
            textAlign: "center",
          }}
        >
          échelle de débits générée <strong>par titre</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <BarMeter
            color={COLORS.netflix}
            fill={1}
            highlight
            label="AV1 · 2160p"
            start={120}
            value="~ 16 Mb/s"
          />
          <BarMeter
            color={COLORS.uv}
            fill={0.42}
            label="VP9 · 1080p"
            start={136}
            value="~ 5 Mb/s"
          />
          <BarMeter
            color={COLORS.cyan}
            fill={0.2}
            label="H.264 · 720p"
            start={152}
            value="~ 3 Mb/s"
          />
          <BarMeter
            color={COLORS.green}
            fill={0.07}
            label="H.264 · 480p"
            start={168}
            value="~ 1 Mb/s"
          />
        </div>
      </div>
    </Stage>

    <Caption start={240}>
      Chaque titre reçoit sa propre échelle : un dessin animé n&apos;a pas les
      mêmes besoins qu&apos;un film d&apos;action.
    </Caption>
  </Backdrop>
);
