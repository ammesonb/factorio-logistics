import { InputNumber, Stack, Toggle } from "rsuite";
import { Item, RESOURCE, Resource } from "./db/DB";
import { DeleteButton } from "./wrappers/DeleteButton";

export const ResourceRow = ({
  resource,
  itemsByID,
  updateQuantity,
  updateConsumed,
  onDelete,
}: {
  resource: Resource;
  itemsByID: { [key: string]: Item };
  updateQuantity: (resourceID: number, quantityPerSec: number) => void;
  updateConsumed: (resourceID: number, isConsumed: boolean) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
}) => (
  <Stack spacing={8}>
    <img src={itemsByID[resource.item].icon} height={32} />
    {itemsByID[resource.item].name}
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
