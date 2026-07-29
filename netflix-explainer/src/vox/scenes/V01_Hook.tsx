import { AbsoluteFill } from "remotion";
import { MARGIN } from "../theme";
import { CircleMark, Highlight } from "../ui/Marks";
import { Headline, Kicker, Paper } from "../ui/Type";

export const V01_Hook: React.FC = () => (
  <Paper>
    <AbsoluteFill
      style={{
        paddingLeft: MARGIN,
        paddingRight: MARGIN,
        justifyContent: "center",
        gap: 90,
      }}
    >
      <Kicker start={6}>Netflix</Kicker>

      <Headline lines={["Tu appuies", "sur play."]} size={124} start={14} />

      <Headline
        lines={[
          <>
            Moins d&apos;une <Highlight start={78}>seconde</Highlight>
          </>,
          "plus tard, l'image",
          "est déjà là.",
        ]}
        size={72}
        start={56}
      />

      <div
        style={{
          position: "relative",
          alignSelf: "flex-start",
          display: "inline-block",
        }}
      >
        <Headline lines={["Comment ?"]} size={104} start={124} />
        {/* Explicit box: edge offsets alone let the mark scale unpredictably. */}
        <CircleMark
          start={140}
          style={{ left: -44, top: -28, width: 620, height: 184 }}
          width={8}
        />
      </div>
    </AbsoluteFill>
  </Paper>
);
