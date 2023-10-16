import { Divider, List, Panel, PanelGroup, Stack } from "rsuite";
import { CATEGORY, LINE, SURFACE, Surface } from "./db/DB";
import { AddButton } from "./wrappers/AddButton";
import { DeleteButton } from "./wrappers/DeleteButton";
import { ProductionToggle } from "./wrappers/ProductionToggle";
import { RenameButton } from "./wrappers/RenameButton";
import { ViewButton } from "./wrappers/ViewButton";

export const SurfaceDetail = ({
  surface,
  onAdd,
  onRename,
  onDelete,
  toggleProduction,
  onPageChange,
}: {
  surface: Surface;
  onAdd: (type: string, parent: string | number) => void;
  onRename: (type: string, id: string | number, currentName: string) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  toggleProduction: (type: string, id: number, enabled: boolean) => void;
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
            <AddButton type={CATEGORY} parent={surface.name} onAdd={onAdd} />
            <DeleteButton type={SURFACE} entity={surface} onDelete={onDelete} />
          </Stack>
          <Divider />
        </>
      }
    >
      <PanelGroup>
        {surface.categories.map((category) => (
          <Panel
            key={`category-${category.id}`}
            eventKey={category.id}
            collapsible
            header={
              <Stack direction="row" style={{ marginRight: "3%" }} spacing={12}>
                <RenameButton
                  onRename={() =>
                    onRename(CATEGORY, category.id as number, category.name)
                  }
                />
                <h4>{category.name}</h4>
                <Stack.Item grow={1} />
                <ProductionToggle
                  type={CATEGORY}
                  id={category.id as number}
                  enabled={category.enabled}
                  toggleProduction={toggleProduction}
                />
                <AddButton
                  type={LINE}
                  parent={category.id as number}
                  onAdd={onAdd}
                />
                <DeleteButton
                  type={CATEGORY}
                  entity={category}
                  onDelete={onDelete}
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
                      <span
                        onClick={(e: React.MouseEvent<HTMLElement>) =>
                          e.stopPropagation()
                        }
                      >
                        <ProductionToggle
                          type={LINE}
                          id={line.id as number}
                          enabled={line.enabled}
                          toggleProduction={toggleProduction}
                        />
                      </span>
                      <DeleteButton
                        type={LINE}
                        entity={line}
                        onDelete={onDelete}
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
