import { Toggle } from "rsuite";

export const ProductionToggle = ({
  type,
  id,
  enabled,
  toggleProduction,
}: {
  type: string;
  id: number;
  enabled: boolean;
  toggleProduction: (type: string, id: number, enabled: boolean) => void;
}) => {
  return (
    <Toggle
      size="lg"
      checked={enabled}
      checkedChildren="Enabled"
      unCheckedChildren="Disabled"
      onChange={(checked) => toggleProduction(type, id, checked)}
    />
  );
};
