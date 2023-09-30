import { InputNumber, Stack, Toggle } from "rsuite";
import { Item, RESOURCE, Resource } from "./db/DB";
import { DeleteButton } from "./wrappers/DeleteButton";
import { ResourcePicker } from "./wrappers/ResourcePicker";

export const ResourceRow = ({
  resource,
  items,
  itemsByID,
  updateResource,
  updateQuantity,
  updateConsumed,
  onDelete,
}: {
  resource: Resource;
  items: Item[];
  itemsByID: { [key: string]: Item };
  updateResource: (resourceID: number, item: string) => void;
  updateQuantity: (resourceID: number, quantityPerSec: number) => void;
  updateConsumed: (resourceID: number, isConsumed: boolean) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
}) => (
  <Stack spacing={8}>
    <img src={itemsByID[resource.item].icon} height={32} />
    <ResourcePicker
      current={resource.item}
      items={items}
      itemsByID={itemsByID}
      onChange={(item: string) => updateResource(resource.id as number, item)}
    />
    <Stack.Item grow={1} />
    <InputNumber
      value={resource.quantityPerSec}
      onChange={(value: string | number) =>
        updateQuantity(
          resource.id as number,
          typeof value === typeof "a"
            ? parseFloat(value as string)
            : (value as number),
        )
      }
    />
    <h6>Is&nbsp;consumed</h6>
    <Toggle
      checked={resource.isConsumed}
      onChange={(isConsumed) =>
        updateConsumed(resource.id as number, isConsumed)
      }
    />
    <Stack.Item grow={4} />
    <DeleteButton
      onClick={() =>
        onDelete(RESOURCE, resource.id as number, itemsByID[resource.item].name)
      }
    />
  </Stack>
);
