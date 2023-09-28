import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import { Container, Content, Header, Sidebar } from "rsuite";
import { DataLoader } from "./DataLoader";
import { Category, db, Line, Surface } from "./db/DB";
import { Surfaces } from "./Surfaces";

const App = () => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const rawData = {
    surfaces: useLiveQuery(() => db.surfaces.toArray(), [], []),
    categories: useLiveQuery(() => db.categories.toArray(), [], []),
    lines: useLiveQuery(() => db.lines.toArray(), [], []),
    resources: useLiveQuery(() => db.resources.toArray(), [], []),
  };

  const surfaces: Surface[] = useMemo(() => {
    const s = [...rawData.surfaces].map((s) => ({ ...s, categories: [] }));

    const surfacesByName: { [key: string]: Surface } = {};
    s.forEach((surface) => (surfacesByName[surface.name] = surface));

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

  return dataLoaded ? (
    <Container>
      <Header>Header</Header>
      <Container>
        <Sidebar>
          <Surfaces surfaces={surfaces} onPageChange={() => {}} />
        </Sidebar>
        <Content>Content</Content>
        <Sidebar>Other sidebar</Sidebar>
      </Container>
    </Container>
  ) : (
    <DataLoader setLoaded={() => setDataLoaded(true)} />
  );
};

export default App;
