import { Copy } from "@rsuite/icons";
import { IconButton } from "rsuite";
import { Line } from "../db/DB";

export const CopyButton = ({
  onDuplicate,
  line,
}: {
  onDuplicate: (line: Line) => void;
  line: Line;
}) => (
  <IconButton
    appearance="primary"
    color="cyan"
    icon={<Copy />}
    onClick={(e) => {
      e.stopPropagation();
      onDuplicate(line);
    }}
  >
    Copy
  </IconButton>
);
