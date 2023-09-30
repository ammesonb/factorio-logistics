import {
  ArrowLeftLine,
  ArrowRightLine,
  CloseOutline,
  History,
} from "@rsuite/icons";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Container,
  Content,
  Header,
  IconButton,
  InputPicker,
  Message,
  Sidebar,
  Stack,
} from "rsuite";
import { AddModal } from "./AddModal";
import { CategoryDetail } from "./CategoryDetail";
import { DataLoader } from "./DataLoader";
import {
  add,
  analyzeResourceUsage,
  Category,
  CATEGORY,
  db,
  deleteEntry,
  ICategory,
  ILine,
  ISurface,
  Item,
  Line,
  LINE,
  parseDBData,
  renameEntry,
  Resource,
  SURFACE,
  Surface,
  updateResourceConsumed,
  updateResourceItem,
  updateResourceQuantity,
} from "./db/DB";
import { DeleteModal } from "./DeleteModal";
import { LineDetail } from "./LineDetail";
import { RenameModal } from "./RenameModal";
import { Resources } from "./Resources";
import { SurfaceDetail } from "./SurfaceDetail";
import { Surfaces } from "./Surfaces";

interface History {
  type: string;
  id: string | number;
  current: boolean;
}

const App = () => {
  const [error, setError] = useState("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(true);

  const [itemsByID, setItems] = useState<{ [key: string]: Item }>({});
  const rawItems: Item[] = useLiveQuery(
    () =>
      db.items
        .toArray()
        // Sort items by name
        .then((items) => items.sort((i1, i2) => (i1.name > i2.name ? 1 : -1)))
        .catch((e) => setError(`Failed to load items: ${e}`)),
    [],
    [],
  ) as Item[];

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
    // resourceProductionRates,
    resourcesSeen,
    // linesByResource,
  } = useMemo(() => analyzeResourceUsage(rawResources), [rawResources]);

  const categoriesByID = useMemo(() => {
    const byID: { [key: number]: Category } = {};
    surfaces.forEach((surface) =>
      surface.categories.forEach(
        (category) => (byID[category.id as number] = category),
      ),
    );
    return byID;
  }, [surfaces]);

  const linesByID = useMemo(() => {
    const byID: { [key: number]: Line } = {};
    surfaces.forEach((surface) =>
      surface.categories.forEach((category) =>
        category.lines.forEach((line) => (byID[line.id as number] = line)),
      ),
    );
    return byID;
  }, [surfaces]);

  const [addType, setAddType] = useState("");
  const [addParent, setAddParent] = useState<string | number>("");

  const openAddDialog = useMemo(
    () => (type: string, parent: string | number) => {
      setAddType(type);
      setAddParent(parent);
    },
    [setAddType, setAddParent],
  );

  const [renameType, setRenameType] = useState("");
  const [renameID, setRenameID] = useState<string | number>("");
  const [renameName, setRenameName] = useState("");

  const openRenameDialog = useMemo(
    () => (type: string, id: string | number, currentName: string) => {
      setRenameType(type);
      setRenameID(id);
      setRenameName(currentName);
    },
    [setAddType, setAddParent],
  );

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

  const [history, setHistory] = useState<History[]>([
    { type: SURFACE, id: "Nauvis", current: true },
  ]);

  const goBack = useMemo(
    () => () =>
      setHistory((history) => {
        const currentIndex = history.map((h) => h.current).indexOf(true);
        let newIndex = currentIndex - 1;
        newIndex = newIndex < 0 ? 0 : newIndex;
        return history.map((h, i) => ({
          ...h,
          current: i === newIndex,
        }));
      }),
    [setHistory],
  );
  const goForward = useMemo(
    () => () =>
      setHistory((history) => {
        const currentIndex = history.map((h) => h.current).indexOf(true);
        let newIndex = currentIndex + 1;
        newIndex = newIndex < history.length ? newIndex : history.length - 1;
        return history.map((h, i) => ({
          ...h,
          current: i === newIndex,
        }));
      }),
    [setHistory],
  );

  const navigate = useMemo(
    () => (pageType: string, pageID: number | string) => {
      // When navigating, strip anything forwards of where we are now to prevent
      // weird split-path from occurring
      const currentIndex = history.map((h) => h.current).indexOf(true);
      setHistory([
        ...history
          .slice(0, currentIndex + 1)
          .map((h) => ({ ...h, current: false })),
        { type: pageType, id: pageID, current: true },
      ]);
    },
    [history, setHistory],
  );

  const currentPage = useMemo(
    () => history.filter((h) => h.current)[0],
    [history],
  );

  const pageBody = useMemo(() => {
    // Don't try to load a page until data has been loaded
    if (!dataLoaded || surfaces.length === 0) {
      return;
    }

    if (currentPage.type === SURFACE) {
      const entity = surfaces.filter(
        (surface) => surface.name === currentPage.id,
      );
      if (entity.length > 0) {
        return (
          <SurfaceDetail
            surface={entity[0] as Surface}
            onAdd={openAddDialog}
            onRename={openRenameDialog}
            onDelete={openDeleteDialog}
            onPageChange={navigate}
          />
        );
      }
    } else if (currentPage.type === CATEGORY) {
      const category = categoriesByID[currentPage.id as number];
      if (category) {
        return (
          <CategoryDetail
            category={category}
            onAdd={openAddDialog}
            onRename={openRenameDialog}
            onDelete={openDeleteDialog}
            items={rawItems}
            itemsByID={itemsByID}
            updateResource={(resourceID: number, item: string) =>
              updateResourceItem(resourceID, item, setError)
            }
            updateResourceQuantity={(
              resourceID: number,
              quantityPerSec: number,
            ) => updateResourceQuantity(resourceID, quantityPerSec, setError)}
            updateResourceConsumed={(resourceID: number, isConsumed: boolean) =>
              updateResourceConsumed(resourceID, isConsumed, setError)
            }
            onPageChange={navigate}
          />
        );
      }
    } else if (currentPage.type === LINE) {
      const line = linesByID[currentPage.id as number];
      if (line) {
        return (
          <LineDetail
            line={line}
            onAdd={openAddDialog}
            onRename={openRenameDialog}
            onDelete={openDeleteDialog}
            items={rawItems}
            itemsByID={itemsByID}
            updateResource={(resourceID: number, item: string) =>
              updateResourceItem(resourceID, item, setError)
            }
            updateResourceQuantity={(
              resourceID: number,
              quantityPerSec: number,
            ) => updateResourceQuantity(resourceID, quantityPerSec, setError)}
            updateResourceConsumed={(resourceID: number, isConsumed: boolean) =>
              updateResourceConsumed(resourceID, isConsumed, setError)
            }
            // onPageChange={navigate}
          />
        );
      }
    }

    setError(`Could not find ${currentPage.type} with ID ${currentPage.id}`);
  }, [dataLoaded, surfaces, currentPage]);

  return dataLoaded ? (
    <Container>
      <Header style={{ marginBottom: "1%" }}>
        <Stack direction="row" spacing={12}>
          <h2>Factorio Logistics</h2>
          <Stack.Item grow={1} />
          <IconButton
            icon={<ArrowLeftLine />}
            onClick={goBack}
            disabled={history[0].current}
          />
          <IconButton
            icon={<ArrowRightLine />}
            onClick={goForward}
            disabled={history[history.length - 1].current}
          />
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
          <Stack.Item grow={3} />
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
            onPageChange={navigate}
            onAdd={openAddDialog}
            onDelete={openDeleteDialog}
          />
        </Sidebar>
        <Content style={{ padding: "0px 2% 0px 2%" }}>
          {error !== "" && (
            <Message type="error" style={{ marginBottom: "3%" }}>
              <Stack direction="row">
                {error}
                <Stack.Item grow={1} />
                <IconButton
                  icon={<CloseOutline />}
                  onClick={() => setError("")}
                />
              </Stack>
            </Message>
          )}
          <AddModal
            type={addType}
            parent={addParent}
            onAdd={(
              type: string,
              parent: string | number,
              name: string,
              onComplete: () => void,
              mostlyConsumes?: boolean,
            ) => add(type, parent, name, onComplete, setError, mostlyConsumes)}
            onClose={() => setAddType("")}
            items={rawItems}
            itemsByID={itemsByID}
          />
          <RenameModal
            type={renameType}
            id={renameID}
            currentName={renameName}
            onRename={(
              type: string,
              id: string | number,
              name: string,
              onComplete: () => void,
            ) => renameEntry(type, id, name, onComplete, setError)}
            onClose={() => setRenameType("")}
          />
          <DeleteModal
            type={deleteType}
            id={deleteID}
            name={deleteName}
            onDelete={(
              type: string,
              id: string | number,
              onComplete: () => void,
            ) => deleteEntry(type, id, onComplete, setError)}
            onClose={() => setDeleteType("")}
          />
          {pageBody}
        </Content>
        <Sidebar>
          <Resources
            itemsByID={itemsByID}
            resources={resourcesSeen}
            onPageChange={navigate}
          />
        </Sidebar>
      </Container>
    </Container>
  ) : (
    <DataLoader setLoaded={() => setDataLoaded(true)} />
  );
};

export default App;
