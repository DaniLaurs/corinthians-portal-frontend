import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem("token");

  const getUser = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const user = getUser();

  const getInitial = (name: string) => {
    return name?.charAt(0).toUpperCase();
  };

  const linkStyle = (path: string) =>
    `block py-2 ${
      location.pathname === path
        ? "text-white font-bold"
        : "text-gray-400"
    } hover:text-white transition`;

  return (
    <nav className="bg-black text-white px-4 sm:px-6 py-4 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      
      <div className="flex items-center justify-between">

        {/* 🔥 LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://logodetimes.com/times/corinthians/logo-corinthians-256.png"
            className="w-8 h-8 sm:w-9 sm:h-9"
          />
          <h1 className="text-sm sm:text-xl font-bold">
            Corinthians Portal
          </h1>
        </Link>

        {/* ☰ BOTÃO MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden bg-white text-black px-3 py-1 rounded"
        >
          ☰
        </button>

        {/* MENU DESKTOP */}
        <div className="hidden sm:flex items-center gap-6">

          <Link to="/" className={linkStyle("/")}>Home</Link>
          <Link to="/classificacao" className={linkStyle("/classificacao")}>Classificação</Link>
          <Link to="/titulos" className={linkStyle("/titulos")}>Títulos</Link>

          {user && (
            <div className="flex items-center gap-2 ml-2 border-l border-gray-700 pl-4">
              <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center font-bold">
                {getInitial(user.name)}
              </div>
              <span className="text-sm">{user.name}</span>
            </div>
          )}

          <div className="relative ml-2">
            <button
              onClick={() => setOpen(!open)}
              className="bg-white text-black px-3 py-1 rounded"
            >
              ☰
            </button>

            {open && (
              <div className="absolute right-0 mt-3 bg-white text-black rounded shadow w-48">

                {!token ? (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                    <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">Cadastro</Link>
                  </>
                ) : (
                  <>
                    <Link to="/perfil" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </>
                )}

              </div>
            )}
          </div>

        </div>
      </div>

      {/* 📱 MENU MOBILE */}
      {open && (
        <div className="sm:hidden mt-4 flex flex-col gap-2">

          <Link to="/" className={linkStyle("/")}>Home</Link>
          <Link to="/classificacao" className={linkStyle("/classificacao")}>Classificação</Link>
          <Link to="/titulos" className={linkStyle("/titulos")}>Títulos</Link>

          {!token ? (
            <>
              <Link to="/login" className="block py-2">Login</Link>
              <Link to="/register" className="block py-2">Cadastro</Link>
            </>
          ) : (
            <>
              <Link to="/perfil" className="block py-2">Perfil</Link>
              <Link to="/admin" className="block py-2">Admin</Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="text-left py-2"
              >
                Sair
              </button>
            </>
          )}

        </div>
      )}
    </nav>
  );
}

export default Navbar;

