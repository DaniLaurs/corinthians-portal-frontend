import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewsDetail from "./pages/NewsDetail";
import Classificacao from "./pages/Classificacao";
import Titulos from "./pages/Titulos";
import Profile from "./pages/Profile";
import Matches from "./pages/matches";
import AdminClassificacao from "./pages/AdminClassificacao";
import type { JSX } from "react";

function AdminRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  let user = null;

  try {
    user = JSON.parse(atob(token.split(".")[1]));
  } catch {
    return <Navigate to="/login" />;
  }

  if (user.email !== "sousal22@outlook.com") {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/news/:id" element={<NewsDetail />} />

        {/* 🔐 ADMIN PROTEGIDO */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* 🔐 ADMIN CLASSIFICAÇÃO PROTEGIDO */}
      
        <Route
          path="/admin/classificacao"
          element={
            <AdminRoute>
              <AdminClassificacao />
            </AdminRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/classificacao" element={<Classificacao />} />

        <Route path="/titulos" element={<Titulos />} />

        <Route path="/perfil" element={<Profile />} />

        <Route path="/matches" element={<Matches />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;