import { useState } from "react";
import { DataLoader } from "./DataLoader";

const App = () => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  return dataLoaded ? (
    "Hello world"
  ) : (
    <DataLoader setLoaded={() => setDataLoaded(true)} />
  );
};

export default App;
