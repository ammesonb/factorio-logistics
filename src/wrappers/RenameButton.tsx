import { Edit } from "@rsuite/icons";
import { IconButton } from "rsuite";

export const RenameButton = ({ onRename }: { onRename: () => void }) => (
  <IconButton
    appearance="primary"
    color="cyan"
    icon={<Edit />}
    onClick={(e) => {
      e.stopPropagation();
      onRename();
    }}
  />
);
