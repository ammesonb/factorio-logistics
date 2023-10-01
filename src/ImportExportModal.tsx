import { createRef, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal } from "rsuite";
import { exportData, importData } from "./db/DB";

export const ImportExportModal = ({
  isExporting,
  open,
  onClose,
}: {
  isExporting: boolean;
  open: boolean;
  onClose: () => void;
}) => {
  const inputRef = createRef<HTMLInputElement>();

  const [importText, setImportText] = useState("");

  useEffect(() => {
    if (inputRef.current === null) {
      return;
    }

    if (open && isExporting) {
      (async () => {
        if (inputRef.current !== null) {
          inputRef.current.value = await exportData();
        }
      })();
    } else {
      inputRef.current.value = "";
      setImportText("");
    }
  }, [open]);

  const handleImportExport = useMemo(
    () => () => {
      if (isExporting) {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setImportText("");
        onClose();
      } else {
        if (inputRef.current) {
          importData(inputRef.current.value);
          inputRef.current.value = "";
          setImportText("");
          onClose();
        }
      }
    },
    [open, isExporting, inputRef],
  );

  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(
    () => setButtonDisabled(!inputRef.current || importText.length < 100),
    [open, inputRef, importText],
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title as="h2">
          {isExporting ? "Export Data" : "Import Data"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          as="textarea"
          rows={8}
          placeholder={isExporting ? "" : "Import data here"}
          inputRef={inputRef}
          onChange={(value) => {
            if (!isExporting) {
              setImportText(value);
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          appearance="primary"
          color={isExporting ? "blue" : "green"}
          onClick={handleImportExport}
          disabled={buttonDisabled}
        >
          {isExporting ? "Done" : "Import"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
