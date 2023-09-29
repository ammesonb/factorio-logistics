import { AdvancedAnalytics, TableColumn } from "@rsuite/icons";
import { Divider, List, Panel, PanelGroup, Stack } from "rsuite";
import { CATEGORY, LINE, Category, RESOURCE } from "./db/DB";
import { AddButton } from "./wrappers/AddButton";
import { DeleteButton } from "./wrappers/DeleteButton";
import { ViewButton } from "./wrappers/ViewButton";

export const CategoryDetail = ({
  category,
  onAdd,
  onDelete,
  onPageChange,
}: {
  category: Category;
  onAdd: (type: string, parent: string | number) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  onPageChange: (pageType: string, pageID: string | number) => void;
}) => {
  return (
    <Panel
      bordered
      header={
        <>
          <Stack direction="row" spacing={12}>
            <h3>{category.name}</h3>
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
                <h4>{line.name}</h4>
                <Stack.Item grow={1} />
                <AddButton
                  icon={AdvancedAnalytics}
                  text="Add resource"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(LINE, line.id as number);
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
                    <Stack direction="row">
                      {resource.item}
                      <Stack.Item grow={1} />
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(
                            RESOURCE,
                            resource.id as number,
                            resource.item,
                          );
                        }}
                      />
                    </Stack>
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
