import React from "react";
import { createRoot } from "react-dom/client";
import { CustomProvider, Loader } from "rsuite";

import "rsuite/dist/rsuite.min.css";
import "./main.css";

const App = React.lazy(() => import(/* webpackChunkName: "app" */ "./App"));

const root = document.getElementById("root") as Element;
createRoot(root).render(
  <React.Suspense
    fallback={<Loader center size="lg" vertical content="Loading..." />}
  >
    <CustomProvider theme="dark">
      <App />
    </CustomProvider>
  </React.Suspense>,
);

document.title = "Factorio Logistics";
