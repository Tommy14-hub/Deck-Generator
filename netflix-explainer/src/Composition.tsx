import { Composition, Folder } from "remotion";
import { NetflixDeepDive } from "./deep/NetflixDeepDive";
import { S01_Title } from "./deep/scenes/S01_Title";
import { S02_Scale } from "./deep/scenes/S02_Scale";
import { S03_TwoPlanes } from "./deep/scenes/S03_TwoPlanes";
import { S04_ControlPlane } from "./deep/scenes/S04_ControlPlane";
import { S05_DataLayer } from "./deep/scenes/S05_DataLayer";
import { S06_Encoding } from "./deep/scenes/S06_Encoding";
import { S07_OpenConnect } from "./deep/scenes/S07_OpenConnect";
import { S08_Playback } from "./deep/scenes/S08_Playback";
import { S09_Resilience } from "./deep/scenes/S09_Resilience";
import { NetflixExplainer } from "./scenes/NetflixExplainer";
import { NetflixArch } from "./arch/NetflixArch";
import { VoxNetflix } from "./vox/VoxNetflix";
import { V01_Hook } from "./vox/scenes/V01_Hook";
import { V02_Scale } from "./vox/scenes/V02_Scale";
import { V03_Problem } from "./vox/scenes/V03_Problem";
import { V04_Split } from "./vox/scenes/V04_Split";
import { V05_Map } from "./vox/scenes/V05_Map";
import { V06_NightFill } from "./vox/scenes/V06_NightFill";
import { V07_Payoff } from "./vox/scenes/V07_Payoff";
import { V08_Outro } from "./vox/scenes/V08_Outro";

export const MyComposition = () => {
  return (
    <>
      <Composition
        component={NetflixArch}
        durationInFrames={2700}
        fps={30}
        height={1920}
        id="NetflixArch"
        width={1080}
      />

      <Composition
        component={VoxNetflix}
        durationInFrames={2700}
        fps={30}
        height={1920}
        id="VoxNetflix"
        width={1080}
      />

      <Folder name="Vox-Scenes">
        <Composition
          component={V01_Hook}
          durationInFrames={210}
          fps={30}
          height={1920}
          id="V01-Accroche"
          width={1080}
        />
        <Composition
          component={V02_Scale}
          durationInFrames={390}
          fps={30}
          height={1920}
          id="V02-Echelle"
          width={1080}
        />
        <Composition
          component={V03_Problem}
          durationInFrames={150}
          fps={30}
          height={1920}
          id="V03-Probleme"
          width={1080}
        />
        <Composition
          component={V04_Split}
          durationInFrames={450}
          fps={30}
          height={1920}
          id="V04-Coupure"
          width={1080}
        />
        <Composition
          component={V05_Map}
          durationInFrames={540}
          fps={30}
          height={1920}
          id="V05-Carte"
          width={1080}
        />
        <Composition
          component={V06_NightFill}
          durationInFrames={360}
          fps={30}
          height={1920}
          id="V06-Nuit"
          width={1080}
        />
        <Composition
          component={V07_Payoff}
          durationInFrames={300}
          fps={30}
          height={1920}
          id="V07-Chute"
          width={1080}
        />
        <Composition
          component={V08_Outro}
          durationInFrames={300}
          fps={30}
          height={1920}
          id="V08-Outro"
          width={1080}
        />
      </Folder>

      <Composition
        component={NetflixDeepDive}
        durationInFrames={2700}
        fps={30}
        height={1920}
        id="NetflixDeepDive"
        width={1080}
      />

      <Folder name="DeepDive-Scenes">
        <Composition
          component={S01_Title}
          durationInFrames={190}
          fps={30}
          height={1920}
          id="D01-Titre"
          width={1080}
        />
        <Composition
          component={S02_Scale}
          durationInFrames={250}
          fps={30}
          height={1920}
          id="D02-Echelle"
          width={1080}
        />
        <Composition
          component={S03_TwoPlanes}
          durationInFrames={310}
          fps={30}
          height={1920}
          id="D03-DeuxPlans"
          width={1080}
        />
        <Composition
          component={S04_ControlPlane}
          durationInFrames={400}
          fps={30}
          height={1920}
          id="D04-ControlPlane"
          width={1080}
        />
        <Composition
          component={S05_DataLayer}
          durationInFrames={310}
          fps={30}
          height={1920}
          id="D05-Donnees"
          width={1080}
        />
        <Composition
          component={S06_Encoding}
          durationInFrames={370}
          fps={30}
          height={1920}
          id="D06-Encodage"
          width={1080}
        />
        <Composition
          component={S07_OpenConnect}
          durationInFrames={400}
          fps={30}
          height={1920}
          id="D07-OpenConnect"
          width={1080}
        />
        <Composition
          component={S08_Playback}
          durationInFrames={310}
          fps={30}
          height={1920}
          id="D08-ABR"
          width={1080}
        />
        <Composition
          component={S09_Resilience}
          durationInFrames={280}
          fps={30}
          height={1920}
          id="D09-Resilience"
          width={1080}
        />
      </Folder>

      <Folder name="V1-30s">
        <Composition
          component={NetflixExplainer}
          durationInFrames={900}
          fps={30}
          height={1920}
          id="NetflixExplainer"
          width={1080}
        />
      </Folder>
    </>
  );
};
