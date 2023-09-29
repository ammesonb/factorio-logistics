import Icon, { IconProps } from "@rsuite/icons/lib/Icon";
import { ForwardRefExoticComponent } from "react";
import { IconButton } from "rsuite";

export const AddButton = ({
  icon,
  text,
  onClick,
}: {
  icon: ForwardRefExoticComponent<IconProps>;
  text?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}) => (
  <IconButton
    appearance="primary"
    color="green"
    icon={<Icon as={icon} />}
    onClick={onClick}
  >
    {text}
  </IconButton>
);
