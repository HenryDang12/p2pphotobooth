import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import List from "./pages/List";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-10 tracking-wide">🎯 Admin Panel</h1>
        <nav className="space-y-3">
          <a
            href="/list"
            className="flex items-center gap-2 py-2 px-4 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition duration-200"
          >
            📋 <span>Danh sách người dùng</span>
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col bg-gray-50">
        <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Quản lý người dùng</h2>
        </header>

        <main className="flex-1 px-8 py-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<List />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
