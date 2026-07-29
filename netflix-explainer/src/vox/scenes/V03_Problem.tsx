import { C } from "../theme";
import { TitleCard } from "../ui/Type";

export const V03_Problem: React.FC = () => (
  <TitleCard
    lines={[
      "Aucun",
      "datacenter",
      <span key="highlight" style={{ color: C.yellow }}>
        ne tient
      </span>,
      "ça.",
    ]}
    size={132}
    start={6}
  />
);
