import { Button } from "rsuite";

export const FPButton = ({
  setFPLine,
  id,
}: {
  setFPLine: (id: number) => void;
  id: number;
}) => (
  <Button
    appearance="primary"
    color="orange"
    onClick={(e) => {
      e.stopPropagation();
      setFPLine(id);
    }}
  >
    FP
  </Button>
);
