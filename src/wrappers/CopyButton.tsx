import { Copy } from "@rsuite/icons";
import { IconButton } from "rsuite";
import { Category, Line } from "../db/DB";

export const CopyButton = ({
  onDuplicate,
  entity,
}: {
  onDuplicate: (entity: Line | Category) => void;
  entity: Line | Category;
}) => (
  <IconButton
    appearance="primary"
    color="cyan"
    icon={<Copy />}
    onClick={(e) => {
      e.stopPropagation();
      onDuplicate(entity);
    }}
  >
    Copy
  </IconButton>
);
