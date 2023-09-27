import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { DataLoader } from "./DataLoader";
import { db } from "./db/DB";

const App = () => {
  const hasData = useLiveQuery(() => db.items.toArray(), [], [])?.length > 0;
  const [dataLoaded, setDataLoaded] = useState<boolean>(hasData);

  return dataLoaded ? (
    "Hello world"
  ) : (
    <DataLoader setLoaded={() => setDataLoaded(true)} />
  );
};

export default App;
