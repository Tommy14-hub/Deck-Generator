import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, MARGIN, MONO, SANS } from "../theme";
import { Highlight } from "../ui/Marks";
import { Body, Headline, Kicker, Paper, rise } from "../ui/Type";

const HOURS = ["00h", "06h", "12h", "18h", "24h"];

/** A day, with the off-peak window Netflix uses to pre-load the edge. */
const DayTimeline: React.FC<{ readonly start: number }> = ({ start }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ opacity: rise(frame, start, 16) }}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          color: C.inkSoft,
          marginBottom: 14,
          letterSpacing: 1,
        }}
      >
        UNE JOURNÉE
      </div>

      <div
        style={{
          position: "relative",
          height: 86,
          backgroundColor: "#E2DBCA",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "25%",
            backgroundColor: C.yellow,
            transformOrigin: "left center",
            scale: `${rise(frame, start + 12, 28)} 1`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "25%",
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: C.ink,
            opacity: rise(frame, start + 34, 12) * 0.35,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          fontFamily: MONO,
          fontSize: 22,
          color: C.inkSoft,
        }}
      >
        {HOURS.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>

      <div
        style={{
          marginTop: 26,
          fontFamily: SANS,
          fontSize: 30,
          fontWeight: 700,
          color: C.ink,
          opacity: rise(frame, start + 44, 16),
        }}
      >
        ← le réseau est vide : c&apos;est là que tout se charge
      </div>
    </div>
  );
};

export const V06_NightFill: React.FC = () => (
  <Paper>
    <AbsoluteFill
      style={{
        paddingLeft: MARGIN,
        paddingRight: MARGIN,
        justifyContent: "center",
        gap: 76,
      }}
    >
      <Kicker start={4}>Le vrai tour de force</Kicker>

      <Headline
        lines={[
          "Pendant que",
          "tu dors,",
          <>
            Netflix les <Highlight start={80}>remplit</Highlight>.
          </>,
        ]}
        size={94}
        start={12}
      />

      <DayTimeline start={120} />

      <Body start={230}>
        Les épisodes que tu lanceras demain sont déjà stockés à quelques
        kilomètres de chez toi. Avant même que tu y penses.
      </Body>
    </AbsoluteFill>
  </Paper>
);
