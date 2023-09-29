import { PageNext, Table, TableColumn, Trash } from "@rsuite/icons";
import { Divider, IconButton, List, Panel, PanelGroup, Stack } from "rsuite";
import { CATEGORY, LINE, SURFACE, Surface } from "./db/DB";

export const SurfaceDetail = ({
  surface,
  onAdd,
  onDelete,
  onPageChange,
}: {
  surface: Surface;
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
            <h3>{surface.name}</h3>
            <Stack.Item grow={1} />
            <IconButton
              icon={<Table />}
              appearance="primary"
              color="green"
              onClick={() => onAdd(CATEGORY, surface.name)}
            >
              Add category
            </IconButton>
            <IconButton
              icon={<Trash />}
              appearance="primary"
              color="red"
              onClick={() => onDelete(SURFACE, surface.name, surface.name)}
            >
              Delete surface
            </IconButton>
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
                <h4>{category.name}</h4>
                <Stack.Item grow={1} />
                <IconButton
                  icon={<TableColumn />}
                  appearance="primary"
                  color="green"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(LINE, category.id as number);
                  }}
                >
                  Add line
                </IconButton>
                <IconButton
                  icon={<Trash />}
                  appearance="primary"
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(CATEGORY, category.id as number, category.name);
                  }}
                >
                  Delete category
                </IconButton>
                <IconButton
                  icon={<PageNext />}
                  onClick={() => onPageChange(CATEGORY, category.id as number)}
                >
                  View
                </IconButton>
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
                    <Stack direction="row">
                      {line.name}
                      <Stack.Item grow={1} />
                      <IconButton
                        icon={<Trash />}
                        appearance="primary"
                        color="red"
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
