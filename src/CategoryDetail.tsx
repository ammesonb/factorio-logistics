import { AdvancedAnalytics, Copy, PageNext, TableColumn } from "@rsuite/icons";
import {
  Button,
  Divider,
  IconButton,
  List,
  Panel,
  PanelGroup,
  Stack,
  Toggle,
} from "rsuite";
import {
  CATEGORY,
  LINE,
  Category,
  Item,
  RESOURCE,
  SURFACE,
  Line,
} from "./db/DB";
import { ResourceRow } from "./ResourceRow";
import { AddButton } from "./wrappers/AddButton";
import { DeleteButton } from "./wrappers/DeleteButton";
import { ProductionToggle } from "./wrappers/ProductionToggle";
import { RenameButton } from "./wrappers/RenameButton";
import { ViewButton } from "./wrappers/ViewButton";

export const CategoryDetail = ({
  category,
  timeUnit,
  onAdd,
  onRename,
  onDelete,
  onDuplicate,
  setFPLine,
  items,
  itemsByID,
  toggleProduction,
  updateCategoryConsumes,
  updateResource,
  updateResourceQuantity,
  updateResourceConsumed,
  onPageChange,
}: {
  category: Category;
  timeUnit: number;
  onAdd: (type: string, parent: string | number, consumed?: boolean) => void;
  onRename: (type: string, id: string | number, currentName: string) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  onDuplicate: (line: Line) => void;
  setFPLine: (lineID: number) => void;
  items: Item[];
  itemsByID: { [key: string]: Item };
  toggleProduction: (type: string, id: number, enabled: boolean) => void;
  updateCategoryConsumes: (categoryID: number, mostlyConsumes: boolean) => void;
  updateResource: (resourceID: number, item: string) => void;
  updateResourceQuantity: (resourceID: number, quantityPerSec: number) => void;
  updateResourceConsumed: (resourceID: number, isConsumed: boolean) => void;
  onPageChange: (pageType: string, pageID: string | number) => void;
}) => {
  return (
    <Panel
      bordered
      header={
        <>
          <Stack direction="row" spacing={12}>
            <RenameButton
              onRename={() =>
                onRename(CATEGORY, category.id as number, category.name)
              }
            />
            <h3>
              <Stack direction="row" spacing={12}>
                <span onClick={() => onPageChange(SURFACE, category.surface)}>
                  {category.surface}
                </span>
                <PageNext />
                {category.name}
              </Stack>
            </h3>
            <Stack.Item grow={12} />
            <Stack.Item>
              Mostly&nbsp;{category.mostlyConsumes ? "consumes" : "produces"}
            </Stack.Item>
            <Toggle
              // negate these because it makes more sense to have the toggle be
              // positive, aka produces
              checked={!category.mostlyConsumes}
              onChange={(consumes) =>
                updateCategoryConsumes(category.id as number, !consumes)
              }
            />
            <Stack.Item grow={1} />
            <ProductionToggle
              type={CATEGORY}
              id={category.id as number}
              enabled={category.enabled}
              toggleProduction={toggleProduction}
            />
            <AddButton
              icon={TableColumn}
              text="Add line"
              onClick={() => onAdd(LINE, category.id as number)}
            />
            <DeleteButton
              text="Delete category"
              onClick={() =>
                onDelete(CATEGORY, category.id as number, category.name)
              }
            />
          </Stack>
          <Divider />
        </>
      }
    >
      <PanelGroup>
        {category.lines.map((line) => (
          <Panel
            key={`line-${line.id}`}
            eventKey={line.id}
            collapsible
            header={
              <Stack direction="row" style={{ marginRight: "3%" }} spacing={12}>
                <RenameButton
                  onRename={() => onRename(LINE, line.id as number, line.name)}
                />
                <h4>{line.name}</h4>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(RESOURCE, line.id as number, category.mostlyConsumes);
                  }}
                />
                <IconButton
                  icon={<Copy />}
                  appearance="primary"
                  color="cyan"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(line);
                  }}
                >
                  Copy
                </IconButton>
                <Button
                  appearance="primary"
                  color="orange"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFPLine(line.id as number);
                  }}
                >
                  FP
                </Button>
                <DeleteButton
                  text="Delete line"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(LINE, line.id as number, line.name);
                  }}
                />
                <ViewButton
                  onClick={() => onPageChange(LINE, line.id as number)}
                />
              </Stack>
            }
          >
            {line.resources.length > 0 && (
              <List bordered>
                {line.resources.map((resource, index) => (
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
                      itemTabIndex={index + 1}
                      quantityTabIndex={line.resources.length + index + 1}
                    />
                  </List.Item>
                ))}
              </List>
            )}
          </Panel>
        ))}
      </PanelGroup>
    </Panel>
  );
};
