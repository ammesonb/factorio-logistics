import { Divider, Panel, Stack } from "rsuite";
import { Item, LINE, Line } from "./db/DB";
import { ResourceRow } from "./ResourceRow";
import { ViewButton } from "./wrappers/ViewButton";

export const ItemDetail = ({
  item,
  lines,
  onPageChange,
  items,
  itemsByID,
  updateResource,
  updateQuantity,
  updateConsumed,
  onDelete,
}: {
  item: Item;
  lines: Line[];
  onPageChange: (pageType: string, pageID: string | number) => void;
  items: Item[];
  itemsByID: { [key: string]: Item };
  updateResource: (resourceID: number, item: string) => void;
  updateQuantity: (resourceID: number, quantityPerSec: number) => void;
  updateConsumed: (resourceID: number, isConsumed: boolean) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
}) => (
  <Panel
    header={
      <>
        <Stack direction="row" spacing={12}>
          <img src={item.icon} height={32} />
          <h3>{item.name}</h3>
        </Stack>
        <Divider />
      </>
    }
  >
    {lines.map((line) => (
      <Panel
        header={
          <Stack direction="row">
            <h4>{line.name}</h4>
            <Stack.Item grow={1} />
            <ViewButton onClick={() => onPageChange(LINE, line.id as number)} />
          </Stack>
        }
        collapsible
        defaultExpanded
        bordered
      >
        {line.resources
          .filter((r) => r.item === item.internalName)
          .map((resource) => (
            <ResourceRow
              key={`resource-${resource.id}`}
              resource={resource}
              items={items}
              itemsByID={itemsByID}
              updateResource={updateResource}
              updateQuantity={updateQuantity}
              updateConsumed={updateConsumed}
              onDelete={onDelete}
            />
          ))}
      </Panel>
    ))}
  </Panel>
);
