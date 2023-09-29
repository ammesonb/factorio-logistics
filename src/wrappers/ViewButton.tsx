import { PageNext } from "@rsuite/icons";
import { IconButton } from "rsuite";

export const ViewButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}) => (
  <IconButton icon={<PageNext />} onClick={onClick}>
    View
  </IconButton>
);
