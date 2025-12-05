// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

function PlaceholderPage() {
  return <h2>테스트 메인 화면 입니다~</h2>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PlaceholderPage />} />
      </Route>
    </Routes>
  );
}
