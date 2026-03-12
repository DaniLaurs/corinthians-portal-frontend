export function Header() {
  return (
    <header className="bg-black/90 text-white border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          ⚽ Portal do Corinthians
        </h1>

        <nav className="flex gap-6">
          <a href="#" className="hover:text-gray-400">Notícias</a>
          <a href="#" className="hover:text-gray-400">Jogos</a>
          <a href="#" className="hover:text-gray-400">Elenco</a>
          <a href="#" className="hover:text-gray-400">Títulos</a>
        </nav>
      </div>
    </header>
  );
}