import { InputNumber, Stack, Toggle } from "rsuite";
import { Item, RESOURCE, Resource } from "./db/DB";
import { DeleteButton } from "./wrappers/DeleteButton";
import { ResourcePicker } from "./wrappers/ResourcePicker";

export const ResourceRow = ({
  resource,
  enabled,
  timeUnit,
  items,
  itemsByID,
  updateResource,
  updateQuantity,
  updateConsumed,
  onDelete,
  onPageChange,
}: {
  resource: Resource;
  enabled: boolean;
  timeUnit: number;
  items: Item[];
  itemsByID: { [key: string]: Item };
  updateResource: (resourceID: number, item: string) => void;
  updateQuantity: (resourceID: number, quantityPerSec: number) => void;
  updateConsumed: (resourceID: number, isConsumed: boolean) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  onPageChange: (pageType: string, id: string) => void;
}) => (
  <Stack spacing={16}>
    <img
      src={itemsByID[resource.item].icon}
      height={32}
      onClick={() => onPageChange(RESOURCE, resource.item)}
      style={{ filter: enabled ? "" : "grayscale(1)" }}
    />
    <ResourcePicker
      current={resource.item}
      items={items}
      itemsByID={itemsByID}
      onChange={(item: string) => updateResource(resource.id as number, item)}
      enabled={enabled}
    />
    <Stack.Item grow={1} />
    <h6>Quantity</h6>
    <Stack.Item basis="120px">
      <InputNumber
        value={resource.quantityPerSec * timeUnit}
        onChange={(value: string | number) =>
          updateQuantity(
            resource.id as number,
            (typeof value === typeof "a"
              ? parseFloat(value as string)
              : (value as number)) / timeUnit,
          )
        }
        disabled={!enabled}
      />
    </Stack.Item>
    <h6>per {{ 1: "sec", 60: "min", 3600: "hour", 86400: "day" }[timeUnit]}</h6>
    <Stack.Item grow={1} />
    <h6>{resource.isConsumed ? "Consuming" : "Producing"}</h6>
    <Toggle
      // negate these because it makes more sense to have the toggle be
      // positive, aka produces
      checked={!resource.isConsumed}
      onChange={(isConsumed) =>
        updateConsumed(resource.id as number, !isConsumed)
      }
      disabled={!enabled}
    />
    <Stack.Item grow={4} />
    <DeleteButton
      onClick={() =>
        onDelete(RESOURCE, resource.id as number, itemsByID[resource.item].name)
      }
    />
  </Stack>
);
