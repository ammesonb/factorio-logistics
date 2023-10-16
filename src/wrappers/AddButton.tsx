import { AdvancedAnalytics, Global, Table, TableColumn } from "@rsuite/icons";
import { IconButton } from "rsuite";
import { CATEGORY, LINE, SURFACE } from "../db/DB";

export const AddButton = ({
  type,
  parent,
  showText,
  onAdd,
  mostlyConsumes,
}: {
  type: string;
  parent: string | number;
  showText?: boolean;
  onAdd: (
    type: string,
    parent: string | number,
    mostlyConsumes?: boolean,
  ) => void;
  mostlyConsumes?: boolean;
}) => (
  <IconButton
    appearance="primary"
    color="green"
    icon={
      type === SURFACE ? (
        <Global />
      ) : type === CATEGORY ? (
        <Table />
      ) : type === LINE ? (
        <TableColumn />
      ) : (
        <AdvancedAnalytics />
      )
    }
    onClick={(e) => {
      e.stopPropagation();
      onAdd(type, parent, mostlyConsumes);
    }}
  >
    {showText === false ? undefined : `Add ${type.toLowerCase()}`}
  </IconButton>
);
