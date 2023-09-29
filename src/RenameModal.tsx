import { useMemo, useState } from "react";
import { Button, Input, Modal } from "rsuite";

export const RenameModal = ({
  type,
  id,
  currentName,
  onRename,
  onClose,
}: {
  type: string;
  id: string | number;
  currentName: string;
  onRename: (
    type: string,
    id: string | number,
    name: string,
    onComplete: () => void,
  ) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");

  const clear = useMemo(
    () => () => {
      setName("");
      onClose();
    },
    [setName],
  );

  const save = useMemo(
    () => () => {
      onRename(type, id, name, clear);
    },
    [type, id, name, onRename, clear],
  );

  return (
    <Modal autoFocus enforceFocus size="md" open={type !== ""} onClose={clear}>
      <Modal.Header>
        <Modal.Title as="h3">Rename {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Update name:</h6>
        <Input
          size="lg"
          autoFocus
          defaultValue={currentName}
          onChange={setName}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.key === "Return" || e.keyCode === 13) {
              save();
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" color="red" onClick={clear}>
          Cancel
        </Button>
        <Button appearance="primary" color="green" onClick={save}>
          Rename
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
