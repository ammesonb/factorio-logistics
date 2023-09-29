import { CloseOutline } from "@rsuite/icons";
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
  analyzeResourceUsage,
  Category,
  CATEGORY,
  db,
  deleteCategory,
  deleteLine,
  deleteResource,
  deleteSurface,
  ICategory,
  ILine,
  ISurface,
  Item,
  Line,
  LINE,
  parseDBData,
  RESOURCE,
  Resource,
  SURFACE,
  Surface,
} from "./db/DB";
import { DeleteModal } from "./DeleteModal";
import { LineDetail } from "./LineDetail";
import { Resources } from "./Resources";
import { SurfaceDetail } from "./SurfaceDetail";
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
        deleteSurface(id as string, (e) =>
          setError(`Failed to remove surface: ${e}`),
        );
        break;
      case CATEGORY:
        deleteCategory(id as number, (e) =>
          setError(`Failed to remove category: ${e}`),
        );
        break;
      case LINE:
        deleteLine(id as number, (e) =>
          setError(`Failed to remove line: ${e}`),
        );
        break;
      case RESOURCE:
        deleteResource(id as number, (e) =>
          setError(`Failed to remove resource: ${e}`),
        );
    }

    onComplete();
  };

  const [pageType, setPageType] = useState("surface");
  const [pageID, setPageID] = useState<string | number>("Nauvis");

  const changePage = useMemo(
    () => (pageType: string, pageID: string | number) => {
      setPageType(pageType);
      setPageID(pageID);
    },
    [setPageID, setPageType],
  );

  const pageBody = useMemo(() => {
    // Don't try to load a page until data has been loaded
    if (!dataLoaded || surfaces.length === 0) {
      return;
    }

    if (pageType === SURFACE) {
      const entity = surfaces.filter((surface) => surface.name === pageID);
      if (entity.length > 0) {
        return (
          <SurfaceDetail
            surface={entity[0] as Surface}
            onAdd={openAddDialog}
            onDelete={openDeleteDialog}
            onPageChange={changePage}
          />
        );
      }
    } else if (pageType === CATEGORY) {
      const category = categoriesByID[pageID as number];
      if (category) {
        return (
          <CategoryDetail
            category={category}
            onAdd={openAddDialog}
            onDelete={openDeleteDialog}
            onPageChange={changePage}
          />
        );
      }
    } else if (pageType === LINE) {
      const line = linesByID[pageID as number];
      if (line) {
        return (
          <LineDetail
            line={line}
            onAdd={openAddDialog}
            onDelete={openDeleteDialog}
            // onPageChange={changePage}
          />
        );
      }
    }

    setError(`Could not find ${pageType} with ID ${pageID}`);
  }, [dataLoaded, surfaces, pageID, pageType]);

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
            onPageChange={changePage}
            onAdd={openAddDialog}
            onDelete={openDeleteDialog}
          />
        </Sidebar>
        <Content style={{ padding: "0px 2% 0px 2%" }}>
          {error !== "" && (
            <Message type="error">
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
          {pageBody}
        </Content>
        <Sidebar>
          <Resources
            items={itemsByID}
            resources={resourcesSeen}
            onPageChange={changePage}
          />
        </Sidebar>
      </Container>
    </Container>
  ) : (
    <DataLoader setLoaded={() => setDataLoaded(true)} />
  );
};

export default App;
