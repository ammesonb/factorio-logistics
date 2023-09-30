import { PageNext } from "@rsuite/icons";
import { Divider, Panel, Stack, Tag } from "rsuite";
import { CATEGORY, Category, Item, LINE, Line, SURFACE } from "./db/DB";
import { ResourceRow } from "./ResourceRow";
import { ViewButton } from "./wrappers/ViewButton";

export const ItemDetail = ({
  item,
  lines,
  categoriesByID,
  timeUnit,
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
  categoriesByID: { [key: number]: Category };
  timeUnit: number;
  onPageChange: (pageType: string, pageID: string | number) => void;
  items: Item[];
  itemsByID: { [key: string]: Item };
  updateResource: (resourceID: number, item: string) => void;
  updateQuantity: (resourceID: number, quantityPerSec: number) => void;
  updateConsumed: (resourceID: number, isConsumed: boolean) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
}) => {
  let totalProduced = 0;
  let totalConsumed = 0;

  const filteredLines = lines.map((l) => ({
    ...l,
    resources: l.resources.filter((r) => {
      if (r.item === item.internalName) {
        if (r.isConsumed) {
          totalConsumed += r.quantityPerSec;
        } else {
          totalProduced += r.quantityPerSec;
        }

        return true;
      }

      return false;
    }),
  }));

  const formatQuantity = (quantity: number): string =>
    `${quantity.toFixed(3).replace(/0*$/, "").replace(/\.$/, "")}/${
      { 1: "sec", 60: "min", 3600: "hour", 86400: "day" }[timeUnit]
    }`;

  console.log(categoriesByID);

  return (
    <Panel
      header={
        <>
          <Stack direction="row" spacing={12}>
            <img src={item.icon} height={32} />
            <h3>{item.name}</h3>
            <Stack.Item grow={1} />
            <h6>
              {totalProduced > totalConsumed
                ? "Surplus"
                : totalProduced === totalConsumed
                ? "Net"
                : "Deficit"}
            </h6>
            <Tag
              color={
                totalProduced > totalConsumed
                  ? "green"
                  : totalProduced === totalConsumed
                  ? "yellow"
                  : "red"
              }
              size="lg"
            >
              {formatQuantity(totalProduced - totalConsumed)}
            </Tag>
            <Stack.Item basis="20px" />
            <h6>Total&nbsp;production:</h6>
            <Tag color="green" size="lg">
              {formatQuantity(totalProduced)}
            </Tag>
            <Stack.Item basis="20px" />
            <h6>Total&nbsp;consumption:</h6>
            <Tag color="orange" size="lg">
              {formatQuantity(totalConsumed)}
            </Tag>
          </Stack>
          <Divider />
        </>
      }
    >
      {filteredLines.map((line) => (
        <Panel
          key={`line-${line.id}`}
          header={
            <Stack direction="row" style={{ marginRight: "3%" }}>
              <h4>
                <Stack direction="row" spacing={12}>
                  <span
                    onClick={() =>
                      onPageChange(
                        SURFACE,
                        categoriesByID[line.categoryID].surface,
                      )
                    }
                  >
                    {categoriesByID[line.categoryID].surface}
                  </span>
                  <PageNext />
                  <span
                    onClick={() =>
                      onPageChange(
                        CATEGORY,
                        categoriesByID[line.categoryID].id as number,
                      )
                    }
                  >
                    {categoriesByID[line.categoryID].name}
                  </span>
                  <PageNext />
                  {line.name}
                </Stack>
              </h4>
              <Stack.Item grow={1} />
              <ViewButton
                onClick={() => onPageChange(LINE, line.id as number)}
              />
            </Stack>
          }
          collapsible
          defaultExpanded
          bordered
        >
          {line.resources.map((resource) => (
            <ResourceRow
              key={`resource-${resource.id}`}
              resource={resource}
              timeUnit={timeUnit}
              items={items}
              itemsByID={itemsByID}
              updateResource={updateResource}
              updateQuantity={updateQuantity}
              updateConsumed={updateConsumed}
              onDelete={onDelete}
              onPageChange={onPageChange}
            />
          ))}
        </Panel>
      ))}
    </Panel>
  );
};
