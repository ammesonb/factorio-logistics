import { useState } from "react";

const App = () => {
  const [dataLoaded] = useState<boolean | null>(null);

  return dataLoaded ? "Hello world" : "No data";
};

export default App;
