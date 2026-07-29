import { AbsoluteFill } from "remotion";
import { C, MARGIN } from "../theme";
import { ShareBar } from "../ui/Chart";
import { Highlight } from "../ui/Marks";
import { Body, Headline, Kicker, Paper, Source } from "../ui/Type";

export const V02_Scale: React.FC = () => (
  <Paper>
    <AbsoluteFill
      style={{
        paddingLeft: MARGIN,
        paddingRight: MARGIN,
        justifyContent: "center",
        gap: 74,
      }}
    >
      <Kicker start={4}>L&apos;échelle</Kicker>

      <Headline
        lines={[
          "Environ",
          <>
            <Highlight color={C.yellow} start={40}>
              300 millions
            </Highlight>
          </>,
          "d'abonnés.",
        ]}
        size={106}
        start={12}
      />

      <Body start={92}>
        Répartis dans plus de 190 pays. Et tous peuvent appuyer sur play en même
        temps.
      </Body>

      <div style={{ marginTop: 20 }}>
        <ShareBar
          label="Netflix, aux heures de pointe"
          restLabel="le reste d'Internet"
          share={0.15}
          start={140}
        />
      </div>

      <Body size={34} start={230}>
        Soit près d&apos;un sixième du trafic descendant mondial, pour un seul
        service.
      </Body>
    </AbsoluteFill>

    <Source start={250}>
      Ordres de grandeur publics — part de trafic mesurée aux heures de pointe
    </Source>
  </Paper>
);
