import { FolderMove } from "@rsuite/icons";
import { IconButton } from "rsuite";

export const MoveButton = ({
  type,
  id,
  name,
  onMove,
}: {
  type: string;
  id: number;
  name: string;
  onMove: (type: string, id: number, name: string) => void;
}) => (
  <IconButton
    appearance="primary"
    color="blue"
    icon={<FolderMove />}
    onClick={(e) => {
      e.stopPropagation();
      onMove(type, id, name);
    }}
  >
    Move
  </IconButton>
);
