import { useEffect, useState } from "react";

export function Header() {
  const [user, setUser] = useState<any>(null);

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="bg-black/90 text-white border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          ⚽ Portal do Corinthians
        </h1>

        <nav className="flex gap-6 items-center">
          <a href="#" className="hover:text-gray-400">Notícias</a>
          <a href="#" className="hover:text-gray-400">Jogos</a>
          <a href="#" className="hover:text-gray-400">Elenco</a>

          {/* 👇 Só aparece se estiver logado */}
          {user && (
            <>
              {user.role === "admin" && (
                <a href="/admin" className="hover:text-gray-400">
                  Admin
                </a>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Sair
              </button>
            </>
          )}

          {/* 👇 Se NÃO estiver logado */}
          {!user && (
            <a href="/login" className="hover:text-gray-400">
              Login
            </a>
          )}
           <a href="/register">Cadastro</a>
        </nav>
      </div>
    </header>
  );
}