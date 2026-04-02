import { BrowserRouter, Routes, Route } from "react-router-dom";

import  Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewsDetail from "./pages/NewsDetail";
import Classificacao from "./pages/Classificacao";
import Titulos from "./pages/Titulos";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/news/:id" element={<NewsDetail />} />

        <Route path="/admin" element={<Admin />} />
        
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/classificacao" element={<Classificacao />} />

        <Route path="/titulos" element={<Titulos />} />

        <Route path="/perfil" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;