import { Loader, Panel, Stack, Tag, TagGroup, Tooltip, Whisper } from "rsuite";
import { Item, RESOURCE } from "./db/DB";

export const UsageSummary = ({
  productionRates,
  timeUnit,
  itemsByID,
  onPageChange,
}: {
  productionRates: { [key: string]: number };
  timeUnit: number;
  itemsByID: { [key: string]: Item };
  onPageChange: (pageType: string, id: string) => void;
}) => {
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
      header={<h4>Resource Usage</h4>}
    >
      <TagGroup>
        {Object.keys(itemsByID).length > 0 &&
          orderedRates.map((item) => (
            // TODO: onclick here
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
