import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { S01_Title } from "./scenes/S01_Title";
import { S02_Scale } from "./scenes/S02_Scale";
import { S03_TwoPlanes } from "./scenes/S03_TwoPlanes";
import { S04_ControlPlane } from "./scenes/S04_ControlPlane";
import { S05_DataLayer } from "./scenes/S05_DataLayer";
import { S06_Encoding } from "./scenes/S06_Encoding";
import { S07_OpenConnect } from "./scenes/S07_OpenConnect";
import { S08_Playback } from "./scenes/S08_Playback";
import { S09_Resilience } from "./scenes/S09_Resilience";

/**
 * 90 s at 30 fps. Scene durations sum to 2820 frames; the eight 15-frame
 * crossfades overlap their neighbours, landing the timeline on exactly 2700.
 */
const CUT = () => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
);

export const NetflixDeepDive: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={190} name="01 · Titre">
      <S01_Title />
    </TransitionSeries.Sequence>
    {CUT()}
    <TransitionSeries.Sequence durationInFrames={250} name="02 · Échelle">
      <S02_Scale />
    </TransitionSeries.Sequence>
    {CUT()}
    <TransitionSeries.Sequence durationInFrames={310} name="03 · Deux plans">
      <S03_TwoPlanes />
    </TransitionSeries.Sequence>
    {CUT()}
    <TransitionSeries.Sequence durationInFrames={400} name="04 · Control plane">
      <S04_ControlPlane />
    </TransitionSeries.Sequence>
    {CUT()}
    <TransitionSeries.Sequence durationInFrames={310} name="05 · Données">
      <S05_DataLayer />
    </TransitionSeries.Sequence>
    {CUT()}
    <TransitionSeries.Sequence durationInFrames={370} name="06 · Encodage">
      <S06_Encoding />
    </TransitionSeries.Sequence>
    {CUT()}
    <TransitionSeries.Sequence durationInFrames={400} name="07 · Open Connect">
      <S07_OpenConnect />
    </TransitionSeries.Sequence>
    {CUT()}
    <TransitionSeries.Sequence durationInFrames={310} name="08 · ABR">
      <S08_Playback />
    </TransitionSeries.Sequence>
    {CUT()}
    <TransitionSeries.Sequence durationInFrames={280} name="09 · Résilience">
      <S09_Resilience />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
