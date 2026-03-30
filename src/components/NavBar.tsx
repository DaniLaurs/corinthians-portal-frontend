import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem("token");

  const getUser = () => {
    const token = localStorage.getItem("token");
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
    `relative hover:text-white transition ${
      location.pathname === path
        ? "text-white font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-red-600"
        : "text-gray-400"
    }`;

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-gray-800 sticky top-0 z-50 shadow-lg">

      {/* 🔥 LOGO */}
      <Link to="/" className="flex items-center gap-2 group">
        <img
          src="https://logodetimes.com/times/corinthians/logo-corinthians-256.png"
          className="w-9 h-9 group-hover:scale-110 transition"
        />

        <h1 className="text-xl font-bold group-hover:text-gray-300 transition">
          Corinthians Portal
        </h1>
      </Link>

      {/* MENU */}
      <div className="flex items-center gap-6">

        <Link to="/" className={linkStyle("/")}>
          Home
        </Link>

        <Link to="/classificacao" className={linkStyle("/classificacao")}>
          Classificação
        </Link>

        <Link to="/titulos" className={linkStyle("/titulos")}>
          Títulos
        </Link>

        {/* 👤 USUÁRIO */}
        {user && (
          <div className="flex items-center gap-2 ml-2 border-l border-gray-700 pl-4">

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold shadow hover:scale-110 transition">
              {getInitial(user.name)}
            </div>

            <span className="font-semibold text-sm text-gray-300">
              {user.name}
            </span>

          </div>
        )}

        {/* ☰ MENU */}
        <div className="relative ml-2">
          <button
            onClick={() => setOpen(!open)}
            className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition shadow"
          >
            ☰
          </button>

          {open && (
            <div className="absolute right-0 mt-3 bg-white text-black rounded-lg shadow-xl w-48 animate-fadeIn overflow-hidden">

              {!token ? (
                <>
                  <Link to="/login" className="block px-4 py-3 hover:bg-gray-100">
                    Login
                  </Link>

                  <Link to="/register" className="block px-4 py-3 hover:bg-gray-100">
                    Cadastro
                  </Link>
                </>
              ) : (
                <>
                  {/* 👤 USER */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-100">

                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                      {getInitial(user.name)}
                    </div>

                    <span className="font-bold text-sm">
                      {user.name}
                    </span>

                  </div>

                  <Link to="/admin" className="block px-4 py-3 hover:bg-gray-100">
                    Admin
                  </Link>

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/";
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </>
              )}

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;