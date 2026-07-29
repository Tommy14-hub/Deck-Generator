import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1_Intro } from "./Scene1_Intro";
import { Scene2_Request } from "./Scene2_Request";
import { Scene3_Microservices } from "./Scene3_Microservices";
import { Scene4_Recommendation } from "./Scene4_Recommendation";
import { Scene5_CDN } from "./Scene5_CDN";
import { Scene6_Outro } from "./Scene6_Outro";

export const NetflixExplainer: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90} name="Intro">
        <Scene1_Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={165} name="La demande">
        <Scene2_Request />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence
        durationInFrames={195}
        name="Microservices"
      >
        <Scene3_Microservices />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence
        durationInFrames={180}
        name="Recommandation"
      >
        <Scene4_Recommendation />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={195} name="Open Connect">
        <Scene5_CDN />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={150} name="Outro">
        <Scene6_Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
