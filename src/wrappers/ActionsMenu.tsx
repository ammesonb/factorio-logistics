import { Button, Popover, Stack, Whisper } from "rsuite";
import { CATEGORY, Category, LINE, Line, Surface } from "../db/DB";
import { CopyButton } from "./CopyButton";
import { DeleteButton } from "./DeleteButton";
import { FPButton } from "./FPButton";

export const ActionsMenu = ({
  type,
  onDelete,
  onDuplicate,
  setFPLine,
  surface,
  category,
  line,
}: {
  type: string;
  onDelete: (type: string, id: number | string, name: string) => void;
  onDuplicate?: (type: string, entity: Line | Category) => void;
  setFPLine?: (id: number) => void;
  surface?: Surface;
  category?: Category;
  line?: Line;
}) => (
  <Whisper
    placement="top"
    trigger="hover"
    speaker={
      <Popover>
        <Stack direction="column" spacing={4}>
          {[LINE, CATEGORY].includes(type) && onDuplicate && (
            <Stack direction="row" spacing={8}>
              <CopyButton
                entity={(line || category) as Line | Category}
                onDuplicate={(entity) => onDuplicate(type, entity)}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={8}>
            {type === LINE && setFPLine && (
              <FPButton
                id={(line as Line).id as number}
                setFPLine={setFPLine}
              />
            )}
            {onDelete && (line || category || surface) && (
              <DeleteButton
                type={type}
                entity={
                  (line || category || surface) as Line | Category | Surface
                }
                onDelete={onDelete}
              />
            )}
          </Stack>
        </Stack>
      </Popover>
    }
    enterable
  >
    <Button appearance="ghost" color="violet">
      More Actions
    </Button>
  </Whisper>
);
