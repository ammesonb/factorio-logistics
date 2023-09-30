import { Loader, Panel, Stack, Tag, TagGroup, Tooltip, Whisper } from "rsuite";
import { Item } from "./db/DB";

export const UsageSummary = ({
  productionRates,
  timeUnit,
  itemsByID,
}: {
  productionRates: { [key: string]: number };
  timeUnit: number;
  itemsByID: { [key: string]: Item };
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

  console.log(productionRates);
  console.log(orderedRates);
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
              placement="top"
              trigger="hover"
              speaker={<Tooltip>{itemsByID[item].name}</Tooltip>}
            >
              <Tag
                key={`item-summary-${item}`}
                color={
                  productionRates[item] > 0
                    ? "green"
                    : productionRates[item] < 0
                    ? "red"
                    : "orange"
                }
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
