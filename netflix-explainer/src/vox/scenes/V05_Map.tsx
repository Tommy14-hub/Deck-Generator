import { AbsoluteFill } from "remotion";
import { MARGIN } from "../theme";
import { Highlight } from "../ui/Marks";
import { Body, Headline, Kicker, Paper, Source } from "../ui/Type";
import { WorldMap } from "../ui/WorldMap";

export const V05_Map: React.FC = () => (
  <Paper>
    <AbsoluteFill
      style={{
        paddingLeft: MARGIN,
        paddingRight: MARGIN,
        justifyContent: "center",
        gap: 70,
      }}
    >
      <Kicker start={4}>La solution</Kicker>

      <Headline
        lines={[
          "Netflix a posé",
          "ses propres serveurs",
          <>
            <Highlight start={78}>chez ton opérateur</Highlight>.
          </>,
        ]}
        size={78}
        start={12}
      />

      <WorldMap start={110} style={{ marginTop: 10 }} />

      <Body start={330}>
        Des milliers de boîtiers, installés directement dans les réseaux des
        opérateurs et aux points d&apos;échange. Pas chez Netflix. Chez eux.
      </Body>
    </AbsoluteFill>

    <Source start={360}>
      Sites représentatifs — programme Netflix Open Connect
    </Source>
  </Paper>
);
