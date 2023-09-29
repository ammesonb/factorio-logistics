import { Table, Trash } from "@rsuite/icons";
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
            header={category.name}
          >
            {category.lines.length > 0 && (
              <List bordered>
                {category.lines.map((line) => (
                  <List.Item
                    key={`line-${line.id}`}
                    onClick={() => onPageChange(LINE, line.id as number)}
                  >
                    {line.name}
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
