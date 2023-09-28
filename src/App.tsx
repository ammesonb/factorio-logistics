import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Container,
  Content,
  Header,
  InputPicker,
  Message,
  Sidebar,
  Stack,
} from "rsuite";
import { AddModal } from "./AddModal";
import { DataLoader } from "./DataLoader";
import {
  analyzeResourceUsage,
  CATEGORY,
  db,
  ICategory,
  ILine,
  ISurface,
  Item,
  LINE,
  // memoizeCategories,
  // memoizeLines,
  parseDBData,
  Resource,
  SURFACE,
  Surface,
} from "./db/DB";
import { DeleteModal } from "./DeleteModal";
import { Resources } from "./Resources";
import { Surfaces } from "./Surfaces";

const App = () => {
  const [error, setError] = useState("");
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
  const rawSurfaces: ISurface[] = useLiveQuery(
    () =>
      db.surfaces
        .toArray()
        .catch((e) => setError(`Failed to load surfaces: ${e}`)),
    [],
    [],
  ) as ISurface[];
  const rawCategories: ICategory[] = useLiveQuery(
    () =>
      db.categories
        .toArray()
        .catch((e) => setError(`Failed to load categories: ${e}`)),
    [],
    [],
  ) as ICategory[];
  const rawLines: ILine[] = useLiveQuery(
    () =>
      db.lines.toArray().catch((e) => setError(`Failed to load lines: ${e}`)),
    [],
    [],
  ) as ILine[];
  const rawResources: Resource[] = useLiveQuery(
    () =>
      db.resources
        .toArray()
        .catch((e) => setError(`Failed to load resources: ${e}`)),
    [],
    [],
  ) as Resource[];

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

  /*
  const categoriesByID = useMemo(
    () => memoizeCategories(rawCategories),
    [rawCategories],
  );

  const linesByID = useMemo(() => memoizeLines(rawLines), [rawLines]);
   */

  const [addType, setAddType] = useState("");
  const [addParent, setAddParent] = useState<string | number>("");

  const openAddDialog = useMemo(
    () => (type: string, parent: string | number) => {
      setAddType(type);
      setAddParent(parent);
    },
    [setAddType, setAddParent],
  );

  const add = (
    type: string,
    parent: string | number,
    name: string,
    onComplete: () => void,
    mostlyConsumes?: boolean,
  ) => {
    switch (type) {
      case SURFACE:
        db.surfaces
          .add({ name })
          .catch((e) => setError(`Failed to add surface: ${e}`));
        break;
      case CATEGORY:
        db.categories
          .add({
            name,
            surface: parent as string,
            mostlyConsumes: mostlyConsumes ?? true,
          })
          .catch((e) => setError(`Failed to add category: ${e}`));
        break;
      case LINE:
        db.lines
          .add({ name, categoryID: parent as number })
          .catch((e) => setError(`Failed to add line: ${e}`));
        break;
    }

    onComplete();
  };

  const [deleteType, setDeleteType] = useState("");
  const [deleteID, setDeleteID] = useState<string | number>("");
  const [deleteName, setDeleteName] = useState("");

  const openDeleteDialog = useMemo(
    () => (type: string, id: string | number, name: string) => {
      setDeleteType(type);
      setDeleteID(id);
      setDeleteName(name);
    },
    [setDeleteType, setDeleteID, setDeleteName],
  );

  const deleteEntry = (
    type: string,
    id: string | number,
    onComplete: () => void,
  ) => {
    switch (type) {
      case SURFACE:
        db.categories
          .where({ surface: id })
          .toArray()
          .then((categories) => {
            categories.forEach((category) =>
              deleteEntry(CATEGORY, category.id as number, () => {}),
            );
          })
          .then(() =>
            db.surfaces
              .delete(id as string)
              .catch((e) => setError(`Failed to remove surface: ${e}`)),
          );
        break;
      case CATEGORY:
        db.lines
          .where({ categoryID: id })
          .toArray()
          .then((lines) =>
            lines.forEach((line) =>
              deleteEntry(LINE, line.id as number, () => {}),
            ),
          )
          .then(() =>
            db.categories
              .delete(id as number)
              .catch((e) => setError(`Failed to remove category: ${e}`)),
          );
        break;
      case LINE:
        db.resources
          .where({ lineID: id })
          .delete()
          .catch((e) => setError(`Failed to remove resources: ${e}`))
          .then(() =>
            db.lines
              .delete(id as number)
              .catch((e) => setError(`Failed to remove line: ${e}`)),
          );
        break;
    }

    onComplete();
  };

  return dataLoaded ? (
    <Container>
      <Header style={{ marginBottom: "1%" }}>
        <Stack direction="row" spacing={12}>
          <h2>Factorio Logistics</h2>
          <Stack.Item style={{ marginLeft: "3%" }}>
            <h5>Time&nbsp;unit:</h5>
          </Stack.Item>
          <Stack.Item basis="120px">
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
        <Sidebar width={320}>
          <Surfaces
            surfaces={surfaces}
            onPageChange={() => {}}
            onAdd={openAddDialog}
            onDelete={openDeleteDialog}
          />
        </Sidebar>
        <Content style={{ padding: "0px 2% 0px 2%" }}>
          {error !== "" && <Message type="error">{error}</Message>}
          <AddModal
            type={addType}
            parent={addParent}
            onAdd={add}
            onClose={() => setAddType("")}
          />
          <DeleteModal
            type={deleteType}
            id={deleteID}
            name={deleteName}
            onDelete={deleteEntry}
            onClose={() => setDeleteType("")}
          />
        </Content>
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
