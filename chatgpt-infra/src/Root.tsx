import { Composition } from "remotion";
import "./index.css";
import "./fonts.css";
import { ChatGPTInfra } from "./ChatGPTInfra";
import { DURATION, FPS } from "./config/scenario";
import { FRAME } from "./design/theme";

/**
 * One composition, one continuous shot.
 *
 * Deliberately no per-stage compositions: the film is a single camera move
 * across one plane, so there is nothing to register scene by scene. Duration
 * and frame size come from config/scenario.ts and design/theme.ts, which keeps
 * the 60 s / 120 s question a one-line change rather than a refactor.
 */
export const RemotionRoot: React.FC = () => (
  <Composition
    component={ChatGPTInfra}
    durationInFrames={DURATION}
    fps={FPS}
    height={FRAME.h}
    id="ChatGPTInfra"
    width={FRAME.w}
  />
);
