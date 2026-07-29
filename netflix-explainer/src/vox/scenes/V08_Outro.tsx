import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NetflixLogo } from "../../deep/NetflixLogo";
import { C, MARGIN, MONO } from "../theme";
import { Headline, Paper, rise } from "../ui/Type";

export const V08_Outro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Paper>
      <AbsoluteFill
        style={{
          paddingLeft: MARGIN,
          paddingRight: MARGIN,
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 70,
        }}
      >
        <NetflixLogo
          progress={rise(frame, 8, 30)}
          style={{ opacity: rise(frame, 6, 10) }}
          width={560}
        />

        <Headline
          lines={["L'infrastructure,", "c'est le produit."]}
          size={86}
          start={44}
        />

        <div
          style={{
            width: 180,
            height: 6,
            backgroundColor: C.red,
            transformOrigin: "left center",
            scale: `${rise(frame, 90, 20)} 1`,
          }}
        />

        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            lineHeight: 1.7,
            color: C.inkSoft,
            opacity: rise(frame, 110, 20),
          }}
        >
          carte : Natural Earth
          <br />
          icônes : Scaleway Ultraviolet
          <br />
          animation : Remotion
        </div>
      </AbsoluteFill>
    </Paper>
  );
};
