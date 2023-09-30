import { AdvancedAnalytics, TableColumn } from "@rsuite/icons";
import { Divider, List, Panel, PanelGroup, Stack, Toggle } from "rsuite";
import { CATEGORY, LINE, Category, Item, RESOURCE } from "./db/DB";
import { ResourceRow } from "./ResourceRow";
import { AddButton } from "./wrappers/AddButton";
import { DeleteButton } from "./wrappers/DeleteButton";
import { RenameButton } from "./wrappers/RenameButton";
import { ViewButton } from "./wrappers/ViewButton";

export const CategoryDetail = ({
  category,
  onAdd,
  onRename,
  onDelete,
  items,
  itemsByID,
  updateCategoryConsumes,
  updateResource,
  updateResourceQuantity,
  updateResourceConsumed,
  onPageChange,
}: {
  category: Category;
  onAdd: (type: string, parent: string | number) => void;
  onRename: (type: string, id: string | number, currentName: string) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  items: Item[];
  itemsByID: { [key: string]: Item };
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
            <h3>{category.name}</h3>
            <Stack.Item grow={12} />
            <Stack.Item>Mostly&nbsp;consumes</Stack.Item>
            <Toggle
              checked={category.mostlyConsumes}
              onChange={(consumes) =>
                updateCategoryConsumes(category.id as number, consumes)
              }
            />
            <Stack.Item grow={1} />
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
      <PanelGroup accordion defaultActiveKey={category.lines[0]?.id}>
        {category.lines.map((line) => (
          <Panel
            key={`line-${line.id}`}
            eventKey={line.id}
            header={
              <Stack direction="row" style={{ marginRight: "3%" }} spacing={12}>
                <RenameButton
                  onRename={() => onRename(LINE, line.id as number, line.name)}
                />
                <h4>{line.name}</h4>
                <Stack.Item grow={1} />
                <AddButton
                  icon={AdvancedAnalytics}
                  text="Add resource"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(RESOURCE, line.id as number);
                  }}
                />
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
        ))}
      </PanelGroup>
    </Panel>
  );
};
