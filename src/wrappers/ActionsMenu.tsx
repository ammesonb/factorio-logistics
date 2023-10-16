import { Button, Popover, Stack, Whisper } from "rsuite";
import { CATEGORY, Category, LINE, Line, Surface } from "../db/DB";
import { CopyButton } from "./CopyButton";
import { DeleteButton } from "./DeleteButton";
import { FPButton } from "./FPButton";
import { MoveButton } from "./MoveButton";

export const ActionsMenu = ({
  type,
  onDelete,
  onDuplicate,
  onMove,
  setFPLine,
  surface,
  category,
  line,
}: {
  type: string;
  onDelete: (type: string, id: number | string, name: string) => void;
  onDuplicate?: (type: string, entity: Line | Category) => void;
  onMove?: (type: string, id: number, name: string) => void;
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
          {[LINE, CATEGORY].includes(type) && (
            <Stack direction="row" spacing={8}>
              {onDuplicate && (
                <CopyButton
                  entity={(line || category) as Line | Category}
                  onDuplicate={(entity) => onDuplicate(type, entity)}
                />
              )}
              {onMove && (
                <MoveButton
                  type={type}
                  id={
                    type === LINE
                      ? ((line as Line).id as number)
                      : ((category as Category).id as number)
                  }
                  name={(line?.name || category?.name) as string}
                  onMove={onMove}
                />
              )}
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
