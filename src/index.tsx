import React from "react";
import ReactDOM from "react-dom";

const App = React.lazy(() => import(/* webpackChunkName: "app" */ "./App"));

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root"),
);

document.title = "";
