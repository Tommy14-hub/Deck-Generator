import { interpolate, useCurrentFrame } from "remotion";
import { C, Card, Def, Detail, MONO, Punch, Slam, Stage, Term, useSnap } from "./kit";
import { WorldMap } from "../vox/ui/WorldMap";

const Bullets: React.FC<{
  readonly items: readonly string[];
  readonly at?: number;
  readonly color?: string;
}> = ({ items, at = 20, color = C.dim }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {items.map((t, i) => (
      <Detail at={at + i * 7} color={color} key={t}>
        {t}
      </Detail>
    ))}
  </div>
);

export const A13_Cassandra: React.FC = () => (
  <Stage glow={C.violet}>
    <Slam />
    <Card accent={C.violet} label="Persistance">
      <Term at={3} color={C.violet} size={46}>
        CASSANDRA
      </Term>
      <Def at={11} size={48}>
        Consistance ajustable, requête par requête.
      </Def>
      <Bullets
        at={22}
        items={[
          "LOCAL_QUORUM : quorum dans la région, jamais inter-continental",
          "réplication asynchrone entre régions",
          "hinted handoff : le nœud absent rattrape ses écritures au retour",
          "on choisit la disponibilité, et on assume la cohérence à terme",
        ]}
      />
    </Card>
  </Stage>
);

export const A14_OpenConnect: React.FC = () => (
  <Stage glow={C.green}>
    <Slam color={C.green} />
    <Card accent={C.green} label="Data plane">
      <Punch at={3} color={C.green} size={112}>
        Open Connect
      </Punch>
      <Def at={13} size={48}>
        Netflix opère son propre CDN.
      </Def>
      <Bullets
        at={24}
        items={[
          "appliances OCA embarquées dans le réseau des FAI",
          "et peering direct aux points d'échange",
          "matériel spécifié par Netflix, livré gratuitement au FAI",
        ]}
      />
    </Card>
  </Stage>
);

export const A15_Bgp: React.FC = () => (
  <Stage glow={C.green}>
    <Slam />
    <Card accent={C.green} label="Steering">
      <Term at={3} color={C.green} size={46}>
        BGP
      </Term>
      <Def at={11} size={46}>
        Le FAI annonce ses préfixes. Netflix écoute.
      </Def>
      <WorldMap
        dotColor={C.green}
        landColor="rgba(255,255,255,0.10)"
        start={26}
        style={{ marginTop: 4 }}
      />
      <Bullets
        at={112}
        items={[
          "session BGP établie avec chaque réseau partenaire",
          "le client est dirigé vers l'OCA qui a le contenu ET la capacité",
          "pas de DNS géo approximatif : la topologie réseau décide",
        ]}
      />
    </Card>
  </Stage>
);

export const A16_Fill: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [18, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage glow={C.amber}>
      <Slam />
      <Card accent={C.amber} label="Remplissage">
        <Term at={3} color={C.amber} size={44}>
          FILL WINDOW
        </Term>
        <Def at={11} size={46}>
          Le contenu est poussé avant d&apos;être demandé.
        </Def>

        <div style={{ marginTop: 10 }}>
          <div
            style={{
              position: "relative",
              height: 62,
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.07)",
              border: `1px solid ${C.line}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "25%",
                backgroundColor: C.amber,
                boxShadow: `0 0 30px ${C.amber}88`,
                transformOrigin: "left center",
                scale: `${grow} 1`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontFamily: MONO,
              fontSize: 22,
              color: C.dim,
              opacity: grow,
            }}
          >
            <span>00h</span>
            <span>06h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>

        <Bullets
          at={48}
          items={[
            "fenêtre creuse : on utilise la bande passante que personne ne paie",
            "popularité prédite par cluster régional, pas globalement",
          ]}
        />
      </Card>
    </Stage>
  );
};

export const A17_Placement: React.FC = () => (
  <Stage glow={C.violet}>
    <Slam />
    <Card accent={C.violet} label="Placement">
      <Term at={3} color={C.violet} size={44}>
        CONSISTENT HASHING
      </Term>
      <Def at={11} size={46}>
        Aucune OCA ne stocke tout le catalogue.
      </Def>
      <Bullets
        at={22}
        items={[
          "paliers de popularité : le catalogue chaud sur SSD",
          "la longue traîne sur disque, ou un cran plus haut dans la hiérarchie",
          "ajouter une appliance ne redistribue qu'une fraction des clés",
        ]}
      />
    </Card>
  </Stage>
);

export const A18_Result: React.FC = () => (
  <Stage glow={C.green}>
    <Slam color={C.green} />
    <Card accent={C.green}>
      <Punch at={2} size={92}>
        Le trafic vidéo
      </Punch>
      <Punch at={9} color={C.green} size={92}>
        ne touche jamais AWS.
      </Punch>
      <Detail at={22} size={30}>
        egress cloud évité · RTT réduit à un saut à l&apos;intérieur du FAI
      </Detail>
    </Card>
  </Stage>
);

export const A19_Encoding: React.FC = () => (
  <Stage glow={C.red}>
    <Slam />
    <Card accent={C.red} label="Encodage">
      <Term at={3} color={C.red} size={42}>
        PER-SHOT ENCODING
      </Term>
      <Def at={11} size={46}>
        Une échelle de débits calculée plan par plan.
      </Def>
      <Bullets
        at={22}
        items={[
          "optimisée sur VMAF, la métrique de qualité perçue de Netflix",
          "un plan fixe et une scène d'action n'ont pas le même coût en bits",
          "même qualité ressentie, débit moyen nettement plus bas",
        ]}
      />
    </Card>
  </Stage>
);

export const A20_Codecs: React.FC = () => (
  <Stage glow={C.red}>
    <Slam />
    <Card accent={C.red} label="Packaging">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["AV1", "VP9", "HEVC", "H.264"].map((codec, i) => (
          <Term at={3 + i * 5} color={C.red} key={codec} size={34}>
            {codec}
          </Term>
        ))}
      </div>
      <Def at={26} size={46}>
        Packagé en DASH, chiffré par DRM.
      </Def>
      <Bullets
        at={36}
        items={[
          "un même titre produit des centaines d'encodages distincts",
          "le device négocie ce qu'il sait décoder en matériel",
          "décoder en logiciel vide la batterie : le codec est un choix produit",
        ]}
      />
    </Card>
  </Stage>
);

const LADDER = [
  { label: "AV1 · 2160p", fill: 1, color: C.red },
  { label: "VP9 · 1080p", fill: 0.42, color: C.violet },
  { label: "H.264 · 720p", fill: 0.2, color: C.cyan },
];

export const A21_Abr: React.FC = () => {
  const frame = useCurrentFrame();
  // Bandwidth collapses mid-scene so the ladder visibly steps down.
  const active = frame < 46 ? 0 : frame < 74 ? 2 : 1;

  return (
    <Stage glow={C.cyan}>
      <Slam />
      <Card accent={C.cyan} label="Lecture">
        <Term at={3} color={C.cyan} size={44}>
          ADAPTIVE BITRATE
        </Term>
        <Def at={10} size={44}>
          Le lecteur pilote sur l&apos;état du buffer.
        </Def>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {LADDER.map((rung, i) => (
            <div key={rung.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 26,
                  width: 250,
                  textAlign: "right",
                  fontWeight: active === i ? 700 : 400,
                  color: active === i ? rung.color : C.dim,
                }}
              >
                {rung.label}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 24,
                  borderRadius: 5,
                  backgroundColor: "rgba(255,255,255,0.07)",
                  overflow: "hidden",
                  border: `1px solid ${active === i ? `${rung.color}77` : "transparent"}`,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${rung.fill * 100}%`,
                    backgroundColor: rung.color,
                    opacity: active === i ? 1 : 0.32,
                    boxShadow: active === i ? `0 0 20px ${rung.color}88` : "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <Bullets
          at={62}
          items={[
            "buffer-based, pas seulement débit-based",
            "on descend d'un barreau plutôt que de se figer",
          ]}
        />
      </Card>
    </Stage>
  );
};

export const A22_Chaos: React.FC = () => (
  <Stage glow={C.red}>
    <Slam color={C.red} />
    <Card accent={C.red} label="Exploitation">
      <Term at={3} color={C.red} size={42}>
        CHAOS ENGINEERING
      </Term>
      <Def at={11} size={46}>
        On provoque la panne pour la maîtriser.
      </Def>
      <Bullets
        at={22}
        items={[
          "des instances sont tuées en production, en continu",
          "l'évacuation d'une région est un exercice répété, pas un plan",
          "ce qui n'est jamais testé ne marche pas le jour J",
        ]}
      />
    </Card>
  </Stage>
);

export const A23_Payoff: React.FC = () => {
  const s = useSnap(26);

  return (
    <Stage glow={C.red}>
      <Slam />
      <Card gap={16}>
        <Punch at={2} size={96}>
          L&apos;infra n&apos;est pas
        </Punch>
        <Punch at={8} size={96}>
          sous le produit.
        </Punch>
        <Punch at={16} color={C.red} size={96}>
          Elle est le produit.
        </Punch>
        <div
          style={{
            marginTop: 26,
            fontFamily: MONO,
            fontSize: 23,
            lineHeight: 1.6,
            color: C.dim,
            opacity: s,
          }}
        >
          icônes : Scaleway Ultraviolet · carte : Natural Earth
          <br />
          animation : Remotion
        </div>
      </Card>
    </Stage>
  );
};
