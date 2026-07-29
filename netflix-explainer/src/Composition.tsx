import { Composition, Folder } from "remotion";
import { NetflixExplainer } from "./scenes/NetflixExplainer";
import { Scene1_Intro } from "./scenes/Scene1_Intro";
import { Scene2_Request } from "./scenes/Scene2_Request";
import { Scene3_Microservices } from "./scenes/Scene3_Microservices";
import { Scene4_Recommendation } from "./scenes/Scene4_Recommendation";
import { Scene5_CDN } from "./scenes/Scene5_CDN";
import { Scene6_Outro } from "./scenes/Scene6_Outro";

export const MyComposition = () => {
  return (
    <>
      <Folder name="Netflix-Scenes">
        <Composition
          id="Scene1-Intro"
          component={Scene1_Intro}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Scene2-Demande"
          component={Scene2_Request}
          durationInFrames={165}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Scene3-Microservices"
          component={Scene3_Microservices}
          durationInFrames={195}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Scene4-Recommandation"
          component={Scene4_Recommendation}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Scene5-OpenConnect"
          component={Scene5_CDN}
          durationInFrames={195}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Scene6-Outro"
          component={Scene6_Outro}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Composition
        id="NetflixExplainer"
        component={NetflixExplainer}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
