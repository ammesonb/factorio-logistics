import { useRef } from "react";
import {
  InputPicker,
  Loader,
  Panel,
  PickerHandle,
  Stack,
  Tag,
  TagGroup,
  Tooltip,
  Whisper,
} from "rsuite";
import { Category, Item, RESOURCE, Surface } from "./db/DB";

export const UsageSummary = ({
  productionRates,
  timeUnit,
  itemsByID,
  onPageChange,
  surfaces,
  categories,
  usageSurface,
  usageCategory,
  setUsageSurface,
  setUsageCategory,
}: {
  productionRates: { [key: string]: number };
  timeUnit: number;
  itemsByID: { [key: string]: Item };
  onPageChange: (pageType: string, id: string) => void;
  surfaces: Surface[];
  categories: Category[];
  usageSurface: string | null;
  usageCategory: number | null;
  setUsageSurface: (surface: string | null) => void;
  setUsageCategory: (category: number | null) => void;
}) => {
  surfaces.sort((s1, s2) => (s1.name > s2.name ? 1 : -1));
  categories.sort((c1, c2) =>
    `${c1.surface} > ${c1.name}` > `${c2.surface} > ${c2.name}` ? 1 : -1,
  );

  const surfaceRef = useRef<PickerHandle>(null);
  const categoryRef = useRef<PickerHandle>(null);

  if (Object.keys(itemsByID).length === 0) {
    return (
      <Panel
        bordered
        collapsible
        defaultExpanded
        header={<h4>Resource Usage</h4>}
      >
        <Loader center inverse size="lg" />
      </Panel>
    );
  }

  const orderedRates = Object.keys(productionRates);
  // Sort to lowest production rates first, but if tied, sort by name
  orderedRates.sort((k1, k2) =>
    productionRates[k1] > productionRates[k2]
      ? 1
      : productionRates[k1] !== productionRates[k2]
      ? -1
      : itemsByID[k1].name > itemsByID[k2].name
      ? 1
      : -1,
  );

  const formatQuantity = (quantity: number): string =>
    `${quantity.toFixed(3).replace(/0*$/, "").replace(/\.$/, "")}/${
      { 1: "sec", 60: "min", 3600: "hour", 86400: "day" }[timeUnit]
    }`;

  return (
    <Panel
      bordered
      collapsible
      defaultExpanded
      header={
        <Stack direction="row" spacing={12}>
          <h4>Resource Usage</h4>
          <Stack.Item grow={1} />
          <span>Surface</span>
          <InputPicker
            data={surfaces.map((s) => ({ label: s.name, value: s.name }))}
            value={usageSurface}
            onChange={(surface) => {
              setUsageSurface(surface);
              setUsageCategory(null);
            }}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              // When menu opens, do not collapse the panel
              // Similarly for on select below
              e.stopPropagation();
              if (surfaceRef.current && surfaceRef.current.open) {
                surfaceRef.current.open();
              }
            }}
            onSelect={(_, __, e) => e.stopPropagation()}
            ref={surfaceRef}
          />
          <span>Category</span>
          <InputPicker
            data={categories.map((c) => ({
              label: `${c.surface} > ${c.name}`,
              value: c.id,
            }))}
            value={usageCategory}
            ref={categoryRef}
            onChange={(category) => {
              setUsageSurface(null);
              setUsageCategory(category);
            }}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              if (categoryRef.current && categoryRef.current.open) {
                categoryRef.current.open();
              }
            }}
            onSelect={(_, __, e) => e.stopPropagation()}
            virtualized
          />
        </Stack>
      }
    >
      <TagGroup>
        {Object.keys(itemsByID).length > 0 &&
          orderedRates.map((item) => (
            <Whisper
              key={`item-summary-${item}`}
              placement="top"
              trigger="hover"
              speaker={<Tooltip>{itemsByID[item].name}</Tooltip>}
            >
              <Tag
                color={
                  productionRates[item] > 0
                    ? "green"
                    : productionRates[item] < 0
                    ? "red"
                    : "orange"
                }
                onClick={() => onPageChange(RESOURCE, item)}
              >
                <Stack spacing={6}>
                  <img src={itemsByID[item].icon} height={24} />
                  {formatQuantity(productionRates[item] * timeUnit)}
                </Stack>
              </Tag>
            </Whisper>
          ))}
      </TagGroup>
    </Panel>
  );
};
