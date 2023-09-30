import { useMemo, useState } from "react";
import { Button, Input, Modal, Stack, Toggle } from "rsuite";
import { CATEGORY, Item, RESOURCE } from "./db/DB";
import { ResourcePicker } from "./wrappers/ResourcePicker";

export const AddModal = ({
  type,
  parent,
  onAdd,
  onClose,
  items,
  itemsByID,
  consumes,
}: {
  type: string;
  parent: string | number;
  onAdd: (
    type: string,
    parent: string | number,
    name: string,
    onComplete: () => void,
    mostlyConsumes?: boolean,
  ) => void;
  onClose: () => void;
  items: Item[];
  itemsByID: { [key: string]: Item };
  consumes?: boolean;
}) => {
  const [name, setName] = useState("");
  const [mostlyConsumes, setMostlyConsumes] = useState(consumes ?? true);

  // Since component is persistent, need to reset consumes on each render if different
  // useEffect doesn't trigger properly since it is based on state, not render
  if ((consumes ?? true) !== mostlyConsumes) {
    setMostlyConsumes(consumes ?? true);
  }

  const clear = useMemo(
    () => () => {
      setName("");
      setMostlyConsumes(true);
      onClose();
    },
    [setName, setMostlyConsumes],
  );

  const save = useMemo(
    () => () => onAdd(type, parent, name, clear, mostlyConsumes),
    [type, parent, name, mostlyConsumes, clear],
  );

  return (
    <Modal autoFocus enforceFocus size="md" open={type !== ""} onClose={clear}>
      <Modal.Header>
        <Modal.Title as="h3">Add {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Name:</h6>
        {type !== RESOURCE ? (
          <Input
            size="lg"
            autoFocus
            onChange={setName}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === "Return" || e.keyCode === 13) {
                save();
              }
            }}
          />
        ) : (
          <ResourcePicker
            current=""
            items={items}
            itemsByID={itemsByID}
            onChange={(resource) => setName(resource)}
          />
        )}
        {type === CATEGORY && (
          <>
            <br />
            <Stack direction="row" spacing={8}>
              <Toggle checked={mostlyConsumes} onChange={setMostlyConsumes} />
              <h6>Category mostly consumes resources?</h6>
            </Stack>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" color="red" onClick={clear}>
          Cancel
        </Button>
        <Button appearance="primary" color="green" onClick={save}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
