import { useEffect, useRef } from "react";
import { InputPicker, PickerHandle } from "rsuite";
import { Item } from "../db/DB";

export const ResourcePicker = ({
  current,
  items,
  itemsByID,
  onChange,
  enabled,
  autoFocus,
  tabIndex,
}: {
  current: string;
  items: Item[];
  itemsByID: { [key: string]: Item };
  onChange: (value: string) => void;
  enabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
}) => {
  const ref = useRef<PickerHandle>(null);

  useEffect(() => {
    if (autoFocus && ref.current && ref.current.open) {
      setTimeout(ref.current.open, 200);
    }
  }, [ref, autoFocus]);

  return (
    <InputPicker
      // Have to use fixed width here to prevent the ResizeObserver loop error with chrome-based browsers
      style={{ width: "250px" }}
      cleanable={false}
      data={items.map((item) => ({
        label: item.name,
        value: item.internalName,
      }))}
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
      autoFocus={autoFocus ?? false}
      ref={ref}
      tabIndex={tabIndex ? tabIndex : 1}
    />
  );
};
