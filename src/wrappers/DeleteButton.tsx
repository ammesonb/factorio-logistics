import { Trash } from "@rsuite/icons";
import { IconButton } from "rsuite";

export const DeleteButton = ({
  text,
  onClick,
}: {
  text?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}) => (
  <IconButton
    appearance="primary"
    color="red"
    icon={<Trash />}
    onClick={onClick}
  >
    {text}
  </IconButton>
);
