import { Trash } from "@rsuite/icons";
import { IconButton } from "rsuite";
import { Category, Line, RESOURCE, Resource, SURFACE, Surface } from "../db/DB";

export const DeleteButton = ({
  type,
  entity,
  onDelete,
  showText,
  name,
}: {
  type: string;
  entity: Resource | Line | Category | Surface;
  onDelete: (type: string, id: number | string, name: string) => void;
  showText?: boolean;
  name?: string;
}) => {
  let text = undefined;
  if (showText !== false) {
    text = `Delete ${type.toLowerCase()}`;
  }

  return (
    <IconButton
      appearance="primary"
      color="red"
      icon={<Trash />}
      onClick={(e) => {
        e.stopPropagation();
        onDelete(
          type,
          type === SURFACE
            ? (entity as Surface).name
            : ((entity as Resource | Line | Category).id as number),
          type !== RESOURCE
            ? (entity as Surface | Category | Line).name
            : name ?? "",
        );
      }}
    >
      {text}
    </IconButton>
  );
};
