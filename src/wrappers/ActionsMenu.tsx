import { Button, Popover, Stack, Whisper } from "rsuite";
import { Category, LINE, Line, Surface } from "../db/DB";
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
  onDuplicate?: (line: Line) => void;
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
        {type === LINE && onDuplicate && setFPLine && (
          <Stack direction="row" spacing={8}>
            <CopyButton line={line as Line} onDuplicate={onDuplicate} />
            <FPButton id={(line as Line).id as number} setFPLine={setFPLine} />
          </Stack>
        )}
        {onDelete && (line || category || surface) && (
          <DeleteButton
            type={type}
            entity={(line || category || surface) as Line | Category | Surface}
            onDelete={onDelete}
          />
        )}
      </Popover>
    }
    enterable
  >
    <Button appearance="ghost" color="violet">
      More Actions
    </Button>
  </Whisper>
);
