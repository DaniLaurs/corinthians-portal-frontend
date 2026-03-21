import { useEffect, useState } from "react";

interface News {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

function Admin() {
  const [news, setNews] = useState<News[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const API = "http://localhost:3000/api/news";

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const loadNews = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setNews(Array.isArray(data) ? data : data.data || []);
  };

  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (user.role !== "admin") {
      window.location.href = "/";
      return;
    }

    loadNews();
  }, []);

  // 🔥 CREATE + UPDATE juntos
  const createNews = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
        image_url: image,
      }),
    });

    // limpa form
    setTitle("");
    setContent("");
    setImage("");
    setEditingId(null);

    loadNews();
  };

  const deleteNews = async (id: number) => {
    const token = localStorage.getItem("token");

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadNews();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start p-10"
      style={{
        backgroundImage:
          "url('https://cdn.meutimao.com.br/_upload/historia/titulos-conquistados/copa_do_brasil_2025.jpg')",
      }}
    >
      <div className="bg-black/90 p-8 rounded-lg w-full max-w-4xl text-white">

        <h1 className="text-3xl font-bold mb-6">
          Painel Admin - Corinthians Portal
        </h1>

        <h2 className="text-xl mb-4">
          {editingId ? "Editando Notícia" : "Criar Nova Notícia"}
        </h2>

        <form onSubmit={createNews} className="flex flex-col gap-4 mb-10">

          <input
            className="p-3 rounded text-black"
            type="text"
            placeholder="Título da notícia"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="p-3 rounded text-black"
            type="text"
            placeholder="URL da imagem"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <textarea
            className="p-3 rounded text-black"
            placeholder="Conteúdo da notícia"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
            {editingId ? "Atualizar notícia" : "Publicar notícia"}
          </button>

        </form>

        <h2 className="text-xl mb-4">Lista de Notícias</h2>

        <div className="grid gap-6">

          {Array.isArray(news) &&
            news.map((item) => (
              <div
                key={item.id}
                className="bg-black border border-gray-700 p-4 rounded"
              >
                <h3 className="text-lg font-bold">{item.title}</h3>

                <img
                  src={item.image_url}
                  alt={item.title}
                  className="mt-3 rounded"
                />

                <p className="mt-3">{item.content}</p>

                {/* ✏️ EDITAR */}
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setTitle(item.title);
                    setContent(item.content);
                    setImage(item.image_url);
                  }}
                  className="mt-4 bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>

                {/* 🗑️ EXCLUIR */}
                <button
                  onClick={() => deleteNews(item.id)}
                  className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            ))}

        </div>

      </div>
    </div>
  );
}

export default Admin;