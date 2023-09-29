import { Table, TableColumn } from "@rsuite/icons";
import { Divider, List, Panel, PanelGroup, Stack } from "rsuite";
import { CATEGORY, LINE, SURFACE, Surface } from "./db/DB";
import { AddButton } from "./wrappers/AddButton";
import { DeleteButton } from "./wrappers/DeleteButton";
import { RenameButton } from "./wrappers/RenameButton";
import { ViewButton } from "./wrappers/ViewButton";

export const SurfaceDetail = ({
  surface,
  onAdd,
  onRename,
  onDelete,
  onPageChange,
}: {
  surface: Surface;
  onAdd: (type: string, parent: string | number) => void;
  onRename: (type: string, id: string | number, currentName: string) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  onPageChange: (pageType: string, pageID: string | number) => void;
}) => {
  return (
    <Panel
      bordered
      header={
        <>
          <Stack direction="row" spacing={12}>
            <RenameButton
              onRename={() => onRename(SURFACE, surface.name, surface.name)}
            />
            <h3>{surface.name}</h3>
            <Stack.Item grow={1} />
            <AddButton
              icon={Table}
              text="Add category"
              onClick={() => onAdd(CATEGORY, surface.name)}
            />
            <DeleteButton
              text="Delete surface"
              onClick={() => onDelete(SURFACE, surface.name, surface.name)}
            />
          </Stack>
          <Divider />
        </>
      }
    >
      <PanelGroup accordion defaultActiveKey={surface.categories[0]?.id}>
        {surface.categories.map((category) => (
          <Panel
            key={`category-${category.id}`}
            eventKey={category.id}
            header={
              <Stack direction="row" style={{ marginRight: "3%" }} spacing={12}>
                <RenameButton
                  onRename={() =>
                    onRename(CATEGORY, category.id as number, category.name)
                  }
                />
                <h4>{category.name}</h4>
                <Stack.Item grow={1} />
                <AddButton
                  icon={TableColumn}
                  text="Add line"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(LINE, category.id as number);
                  }}
                />
                <DeleteButton
                  text="Delete category"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(CATEGORY, category.id as number, category.name);
                  }}
                />
                <ViewButton
                  onClick={() => onPageChange(CATEGORY, category.id as number)}
                />
              </Stack>
            }
          >
            {category.lines.length > 0 && (
              <List bordered>
                {category.lines.map((line) => (
                  <List.Item
                    key={`line-${line.id}`}
                    onClick={() => onPageChange(LINE, line.id as number)}
                  >
                    <Stack direction="row" spacing={12}>
                      <RenameButton
                        onRename={() =>
                          onRename(LINE, line.id as number, line.name)
                        }
                      />
                      {line.name}
                      <Stack.Item grow={1} />
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(LINE, line.id as number, line.name);
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
