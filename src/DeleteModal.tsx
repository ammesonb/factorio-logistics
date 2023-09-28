import { Button, Modal } from "rsuite";

export const DeleteModal = ({
  type,
  id,
  name,
  onDelete,
  onClose,
}: {
  type: string;
  id: string | number;
  name: string;
  onDelete: (type: string, id: number | string, onComplete: () => void) => void;
  onClose: () => void;
}) => {
  return (
    <Modal
      autoFocus
      enforceFocus
      size="md"
      open={type !== ""}
      onClose={onClose}
    >
      <Modal.Header>
        <Modal.Title as="h3">Add {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the {type} {name}?
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="ghost" color="green" onClick={onClose}>
          Cancel
        </Button>
        <Button
          appearance="primary"
          color="red"
          onClick={() => onDelete(type, id, onClose)}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
