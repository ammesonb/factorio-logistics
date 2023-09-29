import { AdvancedAnalytics } from "@rsuite/icons";
import { Divider, List, Panel, Stack } from "rsuite";
import { LINE, Line, RESOURCE } from "./db/DB";
import { AddButton } from "./wrappers/AddButton";
import { DeleteButton } from "./wrappers/DeleteButton";

export const LineDetail = ({
  line,
  onAdd,
  onDelete, // onPageChange,
}: {
  line: Line;
  onAdd: (type: string, parent: string | number) => void;
  onDelete: (type: string, id: string | number, name: string) => void;
  // onPageChange: (pageType: string, pageID: string | number) => void;
}) => {
  return (
    <Panel
      bordered
      header={
        <>
          <Stack direction="row" spacing={12}>
            <h3>{line.name}</h3>
            <Stack.Item grow={1} />
            <AddButton
              icon={AdvancedAnalytics}
              text="Add resource"
              onClick={() => onAdd(RESOURCE, line.id as number)}
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
              <Stack direction="row">
                {resource.item}
                <Stack.Item grow={1} />
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(RESOURCE, resource.id as number, resource.item);
                  }}
                />
              </Stack>
            </List.Item>
          ))}
        </List>
      )}
    </Panel>
  );
};
