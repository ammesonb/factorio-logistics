import { useMemo, useState } from "react";
import { Button, Input, Modal, Toggle } from "rsuite";

export const AddModal = ({
  type,
  parent,
  onAdd,
  onClose,
}: {
  type: string;
  parent: string;
  onAdd: (
    type: string,
    parent: string,
    name: string,
    onComplete: () => void,
    mostlyConsumes?: boolean,
  ) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [mostlyConsumes, setMostlyConsumes] = useState(true);

  const clear = useMemo(
    () => () => {
      setName("");
      setMostlyConsumes(true);
      onClose();
    },
    [setName, setMostlyConsumes],
  );

  const save = useMemo(
    () => () => {
      onAdd(type, parent, name, clear, mostlyConsumes);
    },
    [type, parent, name, onAdd, clear],
  );

  return (
    <Modal autoFocus enforceFocus size="md" open={type !== ""} onClose={clear}>
      <Modal.Header>
        <Modal.Title>Add {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Name:</h6>
        <Input size="lg" onChange={setName} />
        {type === "category" && (
          <>
            <h6>Category mostly consumes resources?</h6>
            <Toggle checked={mostlyConsumes} onChange={setMostlyConsumes} />
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
