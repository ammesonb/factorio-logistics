import { InputPicker } from "rsuite";
import { Item } from "../db/DB";

export const ResourcePicker = ({
  current,
  items,
  itemsByID,
  onChange,
  enabled,
}: {
  current: string;
  items: Item[];
  itemsByID: { [key: string]: Item };
  onChange: (value: string) => void;
  enabled?: boolean;
}) => (
  <InputPicker
    data={items.map((item) => ({ label: item.name, value: item.internalName }))}
    defaultValue={current}
    placeholder="Select item"
    renderMenuItem={(label, item) => (
      <>
        <img
          src={itemsByID[item.value as string].icon}
          height={24}
          style={{ marginRight: "1%" }}
        />
        {label}
      </>
    )}
    onChange={onChange}
    virtualized
    disabled={enabled === false}
  />
);
