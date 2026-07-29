import { AbsoluteFill, Series } from "remotion";
import { C, Rail } from "./kit";
import {
  A01_Click,
  A02_Constraint,
  A03_Scale,
  A04_WrongAnswer,
  A05_Split,
  A06_Why,
  A07_Regions,
  A08_Path,
  A09_Zuul,
  A10_Discovery,
  A11_Breaker,
  A12_Cache,
} from "./actsA";
import {
  A13_Cassandra,
  A14_OpenConnect,
  A15_Bgp,
  A16_Fill,
  A17_Placement,
  A18_Result,
  A19_Encoding,
  A20_Codecs,
  A21_Abr,
  A22_Chaos,
  A23_Payoff,
} from "./actsB";

export const TOTAL = 2700;

/** 23 hard-cut cards averaging 3.9 s — the pace is the point. */
const CUTS = [
  { c: A01_Click, d: 90, n: "01 · Un clic" },
  { c: A02_Constraint, d: 90, n: "02 · La contrainte" },
  { c: A03_Scale, d: 90, n: "03 · Échelle" },
  { c: A04_WrongAnswer, d: 90, n: "04 · Mauvaise réponse" },
  { c: A05_Split, d: 120, n: "05 · La coupure" },
  { c: A06_Why, d: 150, n: "06 · Pourquoi" },
  { c: A07_Regions, d: 150, n: "07 · Multi-région" },
  { c: A08_Path, d: 150, n: "08 · Chemin de requête" },
  { c: A09_Zuul, d: 120, n: "09 · Zuul" },
  { c: A10_Discovery, d: 120, n: "10 · Eureka" },
  { c: A11_Breaker, d: 120, n: "11 · Circuit breaker" },
  { c: A12_Cache, d: 120, n: "12 · EVCache" },
  { c: A13_Cassandra, d: 150, n: "13 · Cassandra" },
  { c: A14_OpenConnect, d: 130, n: "14 · Open Connect" },
  { c: A15_Bgp, d: 150, n: "15 · BGP" },
  { c: A16_Fill, d: 120, n: "16 · Fill window" },
  { c: A17_Placement, d: 120, n: "17 · Placement" },
  { c: A18_Result, d: 80, n: "18 · Résultat" },
  { c: A19_Encoding, d: 120, n: "19 · Encodage" },
  { c: A20_Codecs, d: 120, n: "20 · Codecs" },
  { c: A21_Abr, d: 120, n: "21 · ABR" },
  { c: A22_Chaos, d: 110, n: "22 · Chaos" },
  { c: A23_Payoff, d: 70, n: "23 · Chute" },
] as const;

export const NetflixArch: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Series>
      {CUTS.map(({ c: Scene, d, n }) => (
        <Series.Sequence durationInFrames={d} key={n} name={n}>
          <Scene />
        </Series.Sequence>
      ))}
    </Series>
    <Rail total={TOTAL} />
  </AbsoluteFill>
);
