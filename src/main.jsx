import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import Clarity from "@microsoft/clarity";
Clarity.init("xsu4v072jb");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
