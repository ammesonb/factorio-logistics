import { AdvancedAnalytics } from "@rsuite/icons";
import { Divider, List, Panel, Stack } from "rsuite";
import { Item, LINE, Line, RESOURCE } from "./db/DB";
import { ResourceRow } from "./ResourceRow";
import { AddButton } from "./wrappers/AddButton";
import { DeleteButton } from "./wrappers/DeleteButton";
import { RenameButton } from "./wrappers/RenameButton";

export const LineDetail = ({
  line,
  onAdd,
  onRename,
  onDelete, // onPageChange,
  items,
  itemsByID,
  updateResource,
  updateResourceQuantity,
  updateResourceConsumed,
}: {
  line: Line;
  onAdd: (type: string, parent: string | number) => void;
  onRename: (type: string, id: string | number, currentName: string) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  items: Item[];
  itemsByID: { [key: string]: Item };
  updateResource: (resourceID: number, item: string) => void;
  updateResourceQuantity: (resourceID: number, quantityPerSec: number) => void;
  updateResourceConsumed: (resourceID: number, isConsumed: boolean) => void;
  // onPageChange: (pageType: string, pageID: string | number) => void;
}) => {
  return (
    <Panel
      bordered
      header={
        <>
          <Stack direction="row" spacing={12}>
            <RenameButton
              onRename={() => onRename(LINE, line.id as number, line.name)}
            />
            <h3>{line.name}</h3>
            <Stack.Item grow={1} />
            <AddButton
              icon={AdvancedAnalytics}
              text="Add resource"
              onClick={() => onAdd(RESOURCE, line.id as number)}
            />
            <DeleteButton
              text="Delete line"
              onClick={() => onDelete(LINE, line.id as number, line.name)}
            />
          </Stack>
          <Divider />
        </>
      }
    >
      {line.resources.length > 0 && (
        <List bordered>
          {line.resources.map((resource) => (
            <List.Item key={`resource-${resource.id}`}>
              <ResourceRow
                resource={resource}
                items={items}
                itemsByID={itemsByID}
                updateResource={updateResource}
                updateQuantity={updateResourceQuantity}
                updateConsumed={updateResourceConsumed}
                onDelete={onDelete}
              />
            </List.Item>
          ))}
        </List>
      )}
    </Panel>
  );
};
