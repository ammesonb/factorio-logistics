import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Container,
  Content,
  Header,
  InputPicker,
  Sidebar,
  Stack,
} from "rsuite";
import { DataLoader } from "./DataLoader";
import { analyzeResourceUsage, db, Item, parseDBData, Surface } from "./db/DB";
import { Resources } from "./Resources";
import { Surfaces } from "./Surfaces";

const App = () => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(true);

  const [itemsByID, setItems] = useState<{ [key: string]: Item }>({});
  const rawItems = useLiveQuery(() => db.items.toArray(), [], []);

  const [timeUnit, setTimeUnit] = useState(1);

  // Parse items into a searchable format by internal name
  useEffect(() => {
    const byID: { [key: string]: Item } = {};
    rawItems.forEach((item) => (byID[item.internalName] = item));
    setItems(byID);
  }, [rawItems]);

  // Pull raw configuration data
  const rawSurfaces = useLiveQuery(() => db.surfaces.toArray(), [], []);
  const rawCategories = useLiveQuery(() => db.categories.toArray(), [], []);
  const rawLines = useLiveQuery(() => db.lines.toArray(), [], []);
  const rawResources = useLiveQuery(() => db.resources.toArray(), [], []);

  // Collate the various raw data points into a nested hierarchy
  const surfaces: Surface[] = useMemo(
    () => parseDBData(rawSurfaces, rawCategories, rawLines, rawResources),
    [rawSurfaces, rawCategories, rawLines, rawResources],
  );

  const {
    // byID: resourceProduction,
    resourcesSeen,
    // linesByResource,
  } = useMemo(() => analyzeResourceUsage(rawResources), [rawResources]);

  return dataLoaded ? (
    <Container>
      <Header style={{ marginBottom: "1%" }}>
        <Stack direction="row" spacing={12}>
          <h2>Factorio Logistics</h2>
          <Stack.Item style={{ marginLeft: "3%" }}>
            <h5>Time&nbsp;unit:</h5>
          </Stack.Item>
          <Stack.Item basis={120}>
            <InputPicker
              data={[
                { label: "Second", value: 1 },
                { label: "Minute", value: 60 },
                { label: "Hour", value: 3600 },
                { label: "Day", value: 86400 },
              ]}
              value={timeUnit}
              onChange={(unit) => setTimeUnit(unit)}
            />
          </Stack.Item>
          <Stack.Item grow={1} />
          <Button
            appearance="primary"
            color="cyan"
            onClick={() => setDataLoaded(false)}
          >
            Update Item List
          </Button>
          <Button appearance="primary" color="green">
            Import
          </Button>
          <Button appearance="primary" color="violet">
            Export
          </Button>
        </Stack>
      </Header>
      <Container>
        <Sidebar>
          <Surfaces surfaces={surfaces} onPageChange={() => {}} />
        </Sidebar>
        <Content>Content</Content>
        <Sidebar>
          <Resources
            items={itemsByID}
            resources={resourcesSeen}
            onPageChange={() => {}}
          />
        </Sidebar>
      </Container>
    </Container>
  ) : (
    <DataLoader setLoaded={() => setDataLoaded(true)} />
  );
};

export default App;
