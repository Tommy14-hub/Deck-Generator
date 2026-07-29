import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NetflixLogo } from "../NetflixLogo";
import { COLORS, MONO, SANS } from "../theme";
import { Backdrop } from "../ui/Backdrop";
import { Tag } from "../ui/Chrome";
import { fadeUp, ramp } from "../ui/anim";

export const S01_Title: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Backdrop glow={COLORS.netflix}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        <NetflixLogo
          progress={ramp(frame, 8, 38)}
          style={{ opacity: ramp(frame, 6, 10) }}
          width={760}
        />

        <div
          style={{
            width: 760,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${COLORS.netflix}, transparent)`,
            scale: `${ramp(frame, 44, 24)} 1`,
          }}
        />

        <div
          style={{
            fontFamily: SANS,
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -2,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.05,
            ...fadeUp(frame, 52, 26),
          }}
        >
          L&apos;architecture cloud
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontSize: 32,
            color: COLORS.textDim,
            textAlign: "center",
            ...fadeUp(frame, 64, 20),
          }}
        >
          comment 300 millions d&apos;écrans
          <br />
          reçoivent leurs pixels
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Tag color={COLORS.cyan} label="control plane" start={82} />
          <Tag color={COLORS.uv} label="data plane" start={90} />
          <Tag color={COLORS.green} label="open connect" start={98} />
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
