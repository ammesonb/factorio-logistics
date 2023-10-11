import { FocusEvent, useEffect, useRef } from "react";
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
  itemTabIndex,
  quantityTabIndex,
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
  itemTabIndex?: number;
  quantityTabIndex?: number;
}) => {
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current && quantityTabIndex !== undefined) {
      inputRef.current.getElementsByTagName("input")[0].tabIndex =
        quantityTabIndex;
    }
  }, [inputRef, inputRef.current]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.getElementsByTagName("input")[0].value = (
        resource.quantityPerSec * timeUnit
      ).toString();
    }
  }, [timeUnit]);

  return (
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
        tabIndex={itemTabIndex}
      />
      <Stack.Item grow={1} />
      <h6>Quantity</h6>
      <Stack.Item basis="120px">
        <InputNumber
          defaultValue={(resource.quantityPerSec * timeUnit).toLocaleString(
            undefined,
            { maximumFractionDigits: 3 },
          )}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            updateQuantity(
              resource.id as number,
              parseFloat(e.currentTarget.value) / timeUnit,
            )
          }
          disabled={!enabled}
          ref={inputRef}
        />
      </Stack.Item>
      <h6>
        per {{ 1: "sec", 60: "min", 3600: "hour", 86400: "day" }[timeUnit]}
      </h6>
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
          onDelete(
            RESOURCE,
            resource.id as number,
            itemsByID[resource.item].name,
          )
        }
      />
    </Stack>
  );
};
