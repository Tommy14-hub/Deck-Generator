import { Series } from "remotion";
import { V01_Hook } from "./scenes/V01_Hook";
import { V02_Scale } from "./scenes/V02_Scale";
import { V03_Problem } from "./scenes/V03_Problem";
import { V04_Split } from "./scenes/V04_Split";
import { V05_Map } from "./scenes/V05_Map";
import { V06_NightFill } from "./scenes/V06_NightFill";
import { V07_Payoff } from "./scenes/V07_Payoff";
import { V08_Outro } from "./scenes/V08_Outro";

/**
 * 90 s at 30 fps, cut hard between scenes. Editorial explainers punctuate with
 * cuts rather than crossfades, so this uses <Series> and the durations sum
 * exactly to 2700 frames.
 */
export const VoxNetflix: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={210} name="01 · Accroche">
      <V01_Hook />
    </Series.Sequence>
    <Series.Sequence durationInFrames={390} name="02 · L'échelle">
      <V02_Scale />
    </Series.Sequence>
    <Series.Sequence durationInFrames={150} name="03 · Le problème">
      <V03_Problem />
    </Series.Sequence>
    <Series.Sequence durationInFrames={450} name="04 · La coupure">
      <V04_Split />
    </Series.Sequence>
    <Series.Sequence durationInFrames={540} name="05 · La carte">
      <V05_Map />
    </Series.Sequence>
    <Series.Sequence durationInFrames={360} name="06 · La nuit">
      <V06_NightFill />
    </Series.Sequence>
    <Series.Sequence durationInFrames={300} name="07 · La chute">
      <V07_Payoff />
    </Series.Sequence>
    <Series.Sequence durationInFrames={300} name="08 · Outro">
      <V08_Outro />
    </Series.Sequence>
  </Series>
);
