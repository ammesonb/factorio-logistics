import { createRef, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal } from "rsuite";
import { Line } from "./db/DB";

export const FactoryPlannerModal = ({
  open,
  onClose,
  setFPForLine,
  line,
}: {
  open: boolean;
  onClose: () => void;
  setFPForLine: (fp: string) => void;
  line?: Line;
}) => {
  const inputRef = createRef<HTMLInputElement>();

  const [fpLine, setFPLine] = useState("");

  useEffect(() => {
    if (inputRef.current === null) {
      return;
    }

    if (open) {
      inputRef.current.value = line?.factoryPlannerLine ?? "";
      inputRef.current.focus();
      setFPLine("");
    } else {
      inputRef.current.value = "";
    }
  }, [open]);

  const getLine = useMemo(
    () => () => {
      if (inputRef.current) {
        inputRef.current.value = line?.factoryPlannerLine ?? "";
        setFPLine(line?.factoryPlannerLine ?? "");
      }
    },
    [inputRef, inputRef.current, line, open],
  );

  const setLine = useMemo(
    () => () => {
      setFPForLine(fpLine);
      onClose();
    },
    [inputRef, inputRef.current, line, open],
  );

  const [disableSet, setDisableSet] = useState(true);
  useEffect(
    () => setDisableSet(!inputRef.current || fpLine.length === 0),
    [open, inputRef, fpLine],
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title as="h2">Set or retrieve Factory Planner line</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          as="textarea"
          rows={8}
          placeholder={"Factory Planner export string here"}
          inputRef={inputRef}
          onChange={setFPLine}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          appearance="primary"
          color="blue"
          onClick={setLine}
          disabled={disableSet}
        >
          Set Line
        </Button>

        <Button appearance="primary" color="green" onClick={getLine}>
          Get Line
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
