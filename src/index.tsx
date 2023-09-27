import React from "react";
import { createRoot } from "react-dom/client";

const App = React.lazy(() => import(/* webpackChunkName: "app" */ "./App"));

const root = document.getElementById("root") as Element;
createRoot(root).render(
  <React.Suspense fallback={<div>Loading...</div>}>
    <App />
  </React.Suspense>,
);

document.title = "";
