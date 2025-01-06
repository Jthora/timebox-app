import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Correct import for the default export
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);