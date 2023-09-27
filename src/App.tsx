import { useState } from "react";
import { DataLoader } from "./DataLoader";
import { hasData } from "./db/DB";

const App = () => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(hasData());

  return dataLoaded ? (
    "Hello world"
  ) : (
    <DataLoader setLoaded={() => setDataLoaded(true)} />
  );
};

export default App;
