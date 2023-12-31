import { PageNext } from "@rsuite/icons";
import { Divider, Panel, Stack, Tag } from "rsuite";
import { CATEGORY, Category, Item, LINE, Line, SURFACE } from "./db/DB";
import { ResourceRow } from "./ResourceRow";
import { ProductionToggle } from "./wrappers/ProductionToggle";
import { ViewButton } from "./wrappers/ViewButton";

export const ItemDetail = ({
  item,
  lines,
  categoriesByID,
  timeUnit,
  onPageChange,
  items,
  itemsByID,
  toggleProduction,
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
  toggleProduction: (type: string, id: number, enabled: boolean) => void;
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
          totalConsumed += l.enabled ? r.quantityPerSec : 0;
        } else {
          totalProduced += l.enabled ? r.quantityPerSec : 0;
        }

        return true;
      }

      return false;
    }),
  }));

  filteredLines.sort((l1, l2) => {
    const l1Qty = l1.resources.reduce((s, r) => s + r.quantityPerSec, 0);
    const l2Qty = l2.resources.reduce((s, r) => s + r.quantityPerSec, 0);
    return l1Qty === l2Qty
      ? l1.name > l2.name
        ? 1
        : -1
      : l1Qty < l2Qty
      ? 1
      : -1;
  });

  const formatQuantity = (quantity: number): string =>
    `${quantity.toFixed(3).replace(/0*$/, "").replace(/\.$/, "")}/${
      { 1: "sec", 60: "min", 3600: "hour", 86400: "day" }[timeUnit]
    }`;

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
              :
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
              {formatQuantity((totalProduced - totalConsumed) * timeUnit)}
            </Tag>
            <Stack.Item basis="20px" />
            <h6>Total&nbsp;production:</h6>
            <Tag color="green" size="lg">
              {formatQuantity(totalProduced * timeUnit)}
            </Tag>
            <Stack.Item basis="20px" />
            <h6>Total&nbsp;consumption:</h6>
            <Tag color="orange" size="lg">
              {formatQuantity(totalConsumed * timeUnit)}
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
            <Stack direction="row" style={{ marginRight: "3%" }} spacing={12}>
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
              <ProductionToggle
                type={LINE}
                id={line.id as number}
                enabled={line.enabled}
                toggleProduction={toggleProduction}
              />
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
              enabled={line.enabled ?? true}
            />
          ))}
        </Panel>
      ))}
    </Panel>
  );
};
