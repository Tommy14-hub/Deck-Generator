import { useCurrentFrame } from "remotion";
import { C, Card, Count, Def, Detail, MONO, Punch, Slam, Stage, Term, useSnap } from "./kit";

/** Stacked technical detail lines, staggered fast. */
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

export const A01_Click: React.FC = () => (
  <Stage glow={C.red}>
    <Slam />
    <Card gap={18}>
      <Punch at={2} size={168}>
        UN CLIC.
      </Punch>
      <Punch at={9} color={C.red} size={168}>
        DEUX INFRAS.
      </Punch>
      <Detail at={22} size={31}>
        control plane · data plane — totalement séparés
      </Detail>
    </Card>
  </Stage>
);

export const A02_Constraint: React.FC = () => (
  <Stage glow={C.amber}>
    <Slam />
    <Card accent={C.amber} label="La contrainte">
      <Punch at={4} color={C.amber} size={104}>
        Des dizaines
        <br />
        de Tbit/s
      </Punch>
      <Def at={16}>au pic, simultanés, sur six continents.</Def>
      <Bullets
        at={26}
        items={["→ le scaling vertical n'existe plus à cette échelle"]}
      />
    </Card>
  </Stage>
);

export const A03_Scale: React.FC = () => (
  <Stage glow={C.red}>
    <Slam />
    <Card label="Ordres de grandeur">
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <Count at={4} dur={20} size={150} suffix=" M" to={300} />
      </div>
      <Def at={16}>abonnés payants.</Def>
      <Bullets
        at={26}
        items={[
          "190+ pays desservis",
          "~15 % du trafic descendant mondial aux heures de pointe",
          "des milliers de modèles d'appareils à servir",
        ]}
      />
    </Card>
  </Stage>
);

export const A04_WrongAnswer: React.FC = () => (
  <Stage glow={C.red}>
    <Slam color={C.red} />
    <Card accent={C.red} label="La mauvaise réponse">
      <Punch at={3} size={100}>
        Empiler des
        <br />
        serveurs
      </Punch>
      <Punch at={12} color={C.red} size={100}>
        ne règle rien.
      </Punch>
      <Bullets
        at={26}
        items={[
          "le goulot n'est ni le CPU ni la RAM",
          "c'est la distance physique — et le coût d'egress",
        ]}
      />
    </Card>
  </Stage>
);

export const A05_Split: React.FC = () => {
  const s = useSnap(14);

  return (
    <Stage glow={C.cyan}>
      <Slam />
      <Card accent={C.cyan} label="Décision d'architecture">
        <Punch at={3} size={100}>
          Séparer le calcul
          <br />
          du transport.
        </Punch>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 12,
            opacity: s,
            flexWrap: "wrap",
          }}
        >
          <Term at={18} color={C.cyan}>
            CONTROL PLANE
          </Term>
          <Term at={24} color={C.green}>
            DATA PLANE
          </Term>
        </div>
        <Bullets
          at={34}
          items={[
            "control plane : qui es-tu, que peux-tu voir, quoi te proposer",
            "data plane : les octets du flux, et rien d'autre",
          ]}
        />
      </Card>
    </Stage>
  );
};

export const A06_Why: React.FC = () => (
  <Stage glow={C.cyan}>
    <Slam />
    <Card accent={C.cyan} label="Pourquoi cette coupure">
      <Punch at={3} size={88}>
        Trois raisons.
      </Punch>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 8 }}>
        <div>
          <Def at={12} color={C.cyan} size={38}>
            01 · Coût
          </Def>
          <Detail at={17}>servir des pétaoctets depuis le cloud se paie au Go sortant</Detail>
        </div>
        <div>
          <Def at={26} color={C.cyan} size={38}>
            02 · Latence
          </Def>
          <Detail at={31}>le RTT ne se négocie pas : seule la distance le réduit</Detail>
        </div>
        <div>
          <Def at={40} color={C.cyan} size={38}>
            03 · Blast radius
          </Def>
          <Detail at={45}>le contrôle peut tomber sans interrompre les lectures en cours</Detail>
        </div>
      </div>
    </Card>
  </Stage>
);

export const A07_Regions: React.FC = () => (
  <Stage glow={C.cyan}>
    <Slam />
    <Card accent={C.cyan} label="Control plane">
      <Term at={3} color={C.cyan} size={44}>
        AWS · MULTI-RÉGION
      </Term>
      <Def at={12} size={52}>
        Trois régions, en actif / actif.
      </Def>
      <Bullets
        at={24}
        items={[
          "le client est routé vers la région saine la plus proche",
          "une région entière peut être évacuée sans coupure visible",
          "aucune région n'est un maître : pas de bascule à orchestrer",
        ]}
      />
    </Card>
  </Stage>
);

const HOPS = [
  { label: "DNS", color: C.violet },
  { label: "TLS", color: C.cyan },
  { label: "ZUUL", color: C.cyan },
  { label: "SERVICE", color: C.green },
];

export const A08_Path: React.FC = () => (
  <Stage glow={C.violet}>
    <Slam />
    <Card accent={C.violet} label="Chemin de requête">
      <Punch at={3} size={82}>
        Du doigt au service.
      </Punch>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        {HOPS.map((hop, i) => (
          <div key={hop.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Term at={14 + i * 6} color={hop.color} size={31}>
              {hop.label}
            </Term>
            {i < HOPS.length - 1 ? (
              <Detail at={17 + i * 6} color={C.dim} size={30}>
                →
              </Detail>
            ) : null}
          </div>
        ))}
      </div>
      <Bullets
        at={44}
        items={[
          "résolution anycast → terminaison TLS en périphérie",
          "puis gateway, puis maillage de services",
          "ce chemin ne transporte aucune vidéo — que du JSON",
        ]}
      />
    </Card>
  </Stage>
);

export const A09_Zuul: React.FC = () => (
  <Stage glow={C.cyan}>
    <Slam />
    <Card accent={C.cyan} label="Gateway">
      <Term at={3} color={C.cyan} size={46}>
        ZUUL
      </Term>
      <Def at={11} size={48}>
        Filtres pre / routing / post.
      </Def>
      <Bullets
        at={22}
        items={[
          "routage dynamique, retry, rate-limiting",
          "load shedding : on refuse tôt plutôt que de s'écrouler",
          "les filtres se déploient à chaud, sans redémarrer la flotte",
        ]}
      />
    </Card>
  </Stage>
);

export const A10_Discovery: React.FC = () => (
  <Stage glow={C.cyan}>
    <Slam />
    <Card accent={C.cyan} label="Découverte de services">
      <Term at={3} color={C.cyan} size={42}>
        EUREKA + RIBBON
      </Term>
      <Def at={11} size={48}>
        Load balancing côté client.
      </Def>
      <Bullets
        at={22}
        items={[
          "registre d'instances vivantes, tenu par heartbeats",
          "l'appelant choisit sa cible : pas de LB central à saturer",
          "une instance qui ne bat plus sort du pool toute seule",
        ]}
      />
    </Card>
  </Stage>
);

const STATES = [
  { label: "CLOSED", color: C.green },
  { label: "OPEN", color: C.red },
  { label: "HALF_OPEN", color: C.amber },
];

export const A11_Breaker: React.FC = () => {
  const frame = useCurrentFrame();
  // Cycle the active state so the machine reads as running, not diagrammed.
  const active = Math.floor(Math.max(0, frame - 26) / 16) % STATES.length;

  return (
    <Stage glow={C.amber}>
      <Slam />
      <Card accent={C.amber} label="Résilience">
        <Term at={3} color={C.amber} size={42}>
          CIRCUIT BREAKER
        </Term>
        <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
          {STATES.map((st, i) => (
            <div
              key={st.label}
              style={{
                fontFamily: MONO,
                fontSize: 30,
                fontWeight: 700,
                padding: "12px 20px",
                borderRadius: 10,
                border: `2px solid ${active === i ? st.color : "rgba(255,255,255,0.16)"}`,
                backgroundColor: active === i ? `${st.color}22` : "transparent",
                color: active === i ? st.color : C.dim,
                boxShadow: active === i ? `0 0 24px ${st.color}55` : "none",
                scale: active === i ? "1.06" : "1",
              }}
            >
              {st.label}
            </div>
          ))}
        </div>
        <Bullets
          at={34}
          items={[
            "seuil d'erreur franchi → on ouvre, on arrête d'appeler",
            "bulkheads : un service lent n'épuise pas le pool des autres",
            "on renvoie une réponse dégradée, jamais une page blanche",
          ]}
        />
      </Card>
    </Stage>
  );
};

export const A12_Cache: React.FC = () => (
  <Stage glow={C.green}>
    <Slam />
    <Card accent={C.green} label="Couche cache">
      <Term at={3} color={C.green} size={46}>
        EVCACHE
      </Term>
      <Def at={11} size={48}>
        Memcached, répliqué entre AZ.
      </Def>
      <Bullets
        at={22}
        items={[
          "lecture p99 sous la milliseconde",
          "cache-aside : la base ne voit plus que les miss",
          "réplication multi-AZ pour survivre à la perte d'une zone",
        ]}
      />
    </Card>
  </Stage>
);
