import { useMemo, useState } from "react";
import { Button, InputPicker, Modal } from "rsuite";
import { ItemDataType } from "rsuite/esm/@types/common";

export const MoveModal = ({
  type,
  name,
  id,
  onMove,
  onClose,
  options,
}: {
  type: string;
  name: string;
  id: number;
  onMove: (
    type: string,
    id: number,
    name: string,
    onComplete: () => void,
  ) => void;
  onClose: () => void;
  options: ItemDataType[];
}) => {
  const [newParent, setNewParent] = useState("");

  const disabled = useMemo(() => newParent === "" || !newParent, [newParent]);
  const clear = useMemo(
    () => () => {
      setNewParent("");
      onClose();
    },
    [setNewParent],
  );

  const keyIsEnter = (key: string, keyCode: number): boolean =>
    key === "Enter" || key === "Return" || keyCode === 13;

  const save = useMemo(
    () => () => onMove(type, id, newParent, clear),
    [type, id, newParent, clear],
  );

  return (
    <Modal autoFocus enforceFocus size="md" open={type !== ""} onClose={clear}>
      <Modal.Header>
        <Modal.Title as="h3">
          Move {type} {name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Name:</h6>
        <InputPicker
          data={options}
          size="lg"
          cleanable={false}
          autoFocus
          onChange={setNewParent}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (keyIsEnter(e.key, e.keyCode) && newParent !== "") {
              save();
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" color="red" onClick={clear}>
          Cancel
        </Button>
        <Button
          appearance="primary"
          color="green"
          onClick={save}
          disabled={disabled}
        >
          Move
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
