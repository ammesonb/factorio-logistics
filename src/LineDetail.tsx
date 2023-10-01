import { AdvancedAnalytics, PageNext } from "@rsuite/icons";
import { Divider, List, Panel, Stack } from "rsuite";
import {
  CATEGORY,
  Category,
  Item,
  LINE,
  Line,
  RESOURCE,
  SURFACE,
} from "./db/DB";
import { ResourceRow } from "./ResourceRow";
import { AddButton } from "./wrappers/AddButton";
import { DeleteButton } from "./wrappers/DeleteButton";
import { ProductionToggle } from "./wrappers/ProductionToggle";
import { RenameButton } from "./wrappers/RenameButton";

export const LineDetail = ({
  line,
  category,
  timeUnit,
  onAdd,
  onRename,
  onDelete,
  onPageChange,
  items,
  itemsByID,
  toggleProduction,
  updateResource,
  updateResourceQuantity,
  updateResourceConsumed,
}: {
  line: Line;
  category: Category;
  timeUnit: number;
  onAdd: (
    type: string,
    parent: string | number,
    categoryConsumes: boolean,
  ) => void;
  onRename: (type: string, id: string | number, currentName: string) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  onPageChange: (pageType: string, pageID: string | number) => void;
  items: Item[];
  itemsByID: { [key: string]: Item };
  toggleProduction: (type: string, id: number, enabled: boolean) => void;
  updateResource: (resourceID: number, item: string) => void;
  updateResourceQuantity: (resourceID: number, quantityPerSec: number) => void;
  updateResourceConsumed: (resourceID: number, isConsumed: boolean) => void;
}) => (
  <Panel
    bordered
    header={
      <>
        <Stack direction="row" spacing={12}>
          <RenameButton
            onRename={() => onRename(LINE, line.id as number, line.name)}
          />
          <h3>
            <Stack direction="row" spacing={12}>
              <span onClick={() => onPageChange(SURFACE, category.surface)}>
                {category.surface}
              </span>
              <PageNext />
              <span
                onClick={() => onPageChange(CATEGORY, category.id as number)}
              >
                {category.name}
              </span>
              <PageNext />
              {line.name}
            </Stack>
          </h3>

          <Stack.Item grow={1} />
          <ProductionToggle
            type={LINE}
            id={line.id as number}
            enabled={line.enabled}
            toggleProduction={toggleProduction}
          />
          <AddButton
            icon={AdvancedAnalytics}
            text="Add resource"
            onClick={() =>
              onAdd(RESOURCE, line.id as number, category.mostlyConsumes)
            }
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
              timeUnit={timeUnit}
              items={items}
              itemsByID={itemsByID}
              updateResource={updateResource}
              updateQuantity={updateResourceQuantity}
              updateConsumed={updateResourceConsumed}
              onDelete={onDelete}
              onPageChange={onPageChange}
              enabled={line.enabled ?? true}
            />
          </List.Item>
        ))}
      </List>
    )}
  </Panel>
);
