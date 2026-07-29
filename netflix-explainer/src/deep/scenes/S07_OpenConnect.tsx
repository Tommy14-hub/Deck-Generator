import { useCurrentFrame } from "remotion";
import { CdnIcon, EdgeServicesIcon, ServerIcon } from "../icons";
import { COLORS, MONO } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Stage } from "../ui/Stage";
import { Caption, ChapterHeading } from "../ui/Chrome";
import { InfraNode } from "../ui/Node";
import { Wire } from "../ui/Wire";
import { fadeUp, ramp } from "../ui/anim";

/** Centres of the three edge nodes inside the 920px content column. */
const LEFT = 72;
const MID = 460;
const RIGHT = 848;

const FillWindow: React.FC<{ readonly start: number }> = ({ start }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ ...fadeUp(frame, start, 22) }}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          color: COLORS.textDim,
          marginBottom: 18,
          textAlign: "center",
        }}
      >
        remplissage proactif — pendant les heures creuses
      </div>

      <div
        style={{
          position: "relative",
          height: 46,
          borderRadius: 10,
          backgroundColor: "rgba(255,255,255,0.05)",
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "8.3%",
            width: "16.7%",
            top: 0,
            bottom: 0,
            borderRadius: 8,
            background: `linear-gradient(90deg, ${COLORS.green}66, ${COLORS.green})`,
            boxShadow: `0 0 26px ${COLORS.green}66`,
            transformOrigin: "left center",
            scale: `${ramp(frame, start + 12, 26)} 1`,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
          fontFamily: MONO,
          fontSize: 20,
          color: COLORS.textDim,
        }}
      >
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
    </div>
  );
};

export const S07_OpenConnect: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Backdrop glow={COLORS.green}>
      <ChapterHeading
        accent={COLORS.green}
        index="06"
        subtitle="le CDN que Netflix a construit lui-même"
        title="Open Connect"
      />

      <Stage
        style={{
          top: 480,
          left: 80,
          right: 80,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <InfraNode
            icon={CdnIcon}
            label="ORIGINE"
            size={84}
            start={26}
            sublabel="master encodé"
            tone="netflix"
          />
        </div>

        {/* Fan-out bus from the origin down to the edge appliances. */}
        <div style={{ position: "relative", height: 104 }}>
          <div style={{ position: "absolute", left: MID - 1.5, top: 0 }}>
            <Wire
              color={COLORS.green}
              direction="down"
              drawDuration={14}
              length={44}
              packets={2}
              speed={80}
              start={54}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: LEFT,
              top: 44,
              width: RIGHT - LEFT,
              height: 3,
              borderRadius: 3,
              backgroundColor: `${COLORS.green}70`,
              transformOrigin: "center",
              scale: `${ramp(frame, 68, 22)} 1`,
            }}
          />

          {[LEFT, MID, RIGHT].map((x, i) => (
            <div key={x} style={{ position: "absolute", left: x - 1.5, top: 47 }}>
              <Wire
                color={COLORS.green}
                direction="down"
                drawDuration={12}
                length={54}
                packets={2}
                speed={80}
                start={86 + i * 6}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <InfraNode
            icon={EdgeServicesIcon}
            label="OCA · IXP"
            size={72}
            start={104}
            sublabel="point d'échange"
            tone="green"
          />
          <InfraNode
            icon={ServerIcon}
            label="OCA · FAI"
            live
            size={72}
            start={112}
            sublabel="dans le réseau"
            tone="green"
          />
          <InfraNode
            icon={ServerIcon}
            label="OCA · FAI"
            size={72}
            start={120}
            sublabel="dans le réseau"
            tone="green"
          />
        </div>

        <FillWindow start={175} />
      </Stage>

      <Caption start={280}>
        Le contenu est poussé <strong>avant</strong> d&apos;être demandé, selon
        la popularité prédite — puis servi depuis le réseau de ton propre FAI.
      </Caption>
    </Backdrop>
  );
};
