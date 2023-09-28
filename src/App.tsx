import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import { Button, Container, Content, Header, Sidebar, Stack } from "rsuite";
import { DataLoader } from "./DataLoader";
import { Category, db, Item, Line, Resource, Surface } from "./db/DB";
import { Resources } from "./Resources";
import { Surfaces } from "./Surfaces";

const App = () => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const [itemsByID, setItems] = useState<{ [key: string]: Item }>({});
  const rawItems = useLiveQuery(() => db.items.toArray(), [], []);

  // Parse items into a searchable format by internal name
  useEffect(() => {
    const byID: { [key: string]: Item } = {};
    rawItems.forEach((item) => (byID[item.internalName] = item));
    setItems(byID);
  }, [rawItems]);

  // Pull raw configuration data
  const rawData = {
    surfaces: useLiveQuery(() => db.surfaces.toArray(), [], []),
    categories: useLiveQuery(() => db.categories.toArray(), [], []),
    lines: useLiveQuery(() => db.lines.toArray(), [], []),
    resources: useLiveQuery(() => db.resources.toArray(), [], []),
  };

  // Collate the various raw data points into a nested hierarchy
  const surfaces: Surface[] = useMemo(() => {
    // First initialize "real" surfaces
    const s = [...rawData.surfaces].map((s) => ({ ...s, categories: [] }));

    const surfacesByName: { [key: string]: Surface } = {};
    s.forEach((surface) => (surfacesByName[surface.name] = surface));

    // Then populate categories, lines, and resources
    const categoriesByID: { [key: string]: Category } = {};
    const linesByID: { [key: string]: Line } = {};

    rawData.categories.forEach((dbCat) => {
      const category = { ...dbCat, lines: [] };
      surfacesByName[category.surface].categories.push(category);
      categoriesByID[category.id] = category;
    });

    rawData.lines.forEach((dbLine) => {
      const line = { ...dbLine, resources: [] };
      categoriesByID[line.categoryID].lines.push(line);
      linesByID[line.id] = line;
    });

    rawData.resources.forEach((dbRes) => {
      linesByID[dbRes.lineID].resources.push(dbRes);
    });

    return s;
  }, [rawData.surfaces, rawData.categories, rawData.lines, rawData.resources]);

  // Summarize resource usage by resource and also cache the lines they are each used in
  // for easier checking of usage later
  // resourceSummary
  const [, setResourceSummary] = useState<{
    [key: string]: number;
  }>({});
  const [usedResources, setUsedResources] = useState<Resource[]>([]);
  // linesByResource
  const [, setResourceLines] = useState<{
    [key: string]: string[];
  }>({});

  // Each time resources changes, re-index the summary and other references
  useEffect(() => {
    const byID: { [key: string]: number } = {};
    const distinctResources: Set<Resource> = new Set();
    const linesByResource: { [key: string]: string[] } = {};
    rawData.resources.forEach((resource) => {
      distinctResources.add(resource);
      byID[resource.item] =
        byID?.[resource.item] +
        (resource.isConsumed ? -1 : 1) * resource.quantityPerSec;
      linesByResource[resource.item] = [
        ...(linesByResource?.[resource.item] || []),
        resource.lineID,
      ];
    });

    setResourceSummary(byID);
    setUsedResources(Array.from(distinctResources));
    setResourceLines(linesByResource);
  }, [rawData.resources]);

  return dataLoaded ? (
    <Container>
      <Header style={{ marginBottom: "1%" }}>
        <Stack direction="row" spacing={12}>
          <h2>Factorio Logistics</h2>
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
            resources={usedResources}
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
