import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import DetailPage from "./DetailPage";
//import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

const routing = (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/detailPage" element={<DetailPage />} />
    </Routes>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
