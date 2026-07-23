import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CameraApp from "./components/CameraSwitcher.jsx";
import "./index.css";
import Home from "./pages/Home.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home  />} />
      <Route path="/CameraSwitcher" element={<CameraApp />} />
    </Routes>
  </BrowserRouter>
);