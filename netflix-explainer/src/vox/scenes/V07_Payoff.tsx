import { AbsoluteFill } from "remotion";
import { C, MARGIN, SANS } from "../theme";
import { Highlight } from "../ui/Marks";
import { Headline, Paper, rise } from "../ui/Type";
import { useCurrentFrame } from "remotion";

export const V07_Payoff: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Paper bg={C.ink}>
      <AbsoluteFill
        style={{
          paddingLeft: MARGIN,
          paddingRight: MARGIN,
          justifyContent: "center",
          gap: 70,
        }}
      >
        <Headline
          color={C.white}
          lines={[
            "C'est pour ça",
            "que ça démarre",
            <>
              <Highlight color={C.yellow} start={92}>
                <span style={{ color: C.ink }}>tout de suite</span>
              </Highlight>
              .
            </>,
          ]}
          size={106}
          start={10}
        />

        <div
          style={{
            fontFamily: SANS,
            fontSize: 40,
            fontWeight: 500,
            lineHeight: 1.4,
            color: "#A9A296",
            opacity: rise(frame, 150, 22),
            translate: `0px ${(1 - rise(frame, 150, 22)) * 18}px`,
          }}
        >
          La vidéo ne traverse pas la planète pour t&apos;atteindre.
          <br />
          Elle était déjà là.
        </div>
      </AbsoluteFill>
    </Paper>
  );
};
