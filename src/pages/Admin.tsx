import { useEffect, useState } from "react";

interface News {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

interface Comment {
  id: number;
  content: string;
  news_id: number;
  user_id: number;
}

interface Standing {
  id: number;
  team_name: string;
  points: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals_diff: number;
}

function Admin() {
  const [news, setNews] = useState<News[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [commentsList, setCommentsList] = useState<{ [key: number]: Comment[] }>({});

  // 🆕 CLASSIFICAÇÃO
  const [standings, setStandings] = useState<Standing[]>([]);

  const API = "http://localhost:3000/api/news";
  const COMMENT_API = "http://localhost:3000/api/comments";
  const STANDINGS_API = "http://localhost:3000/api/standings";

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  // 🔥 NEWS
  const loadNews = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const newsList = data.data;
      setNews(newsList);

      newsList.forEach((item: News) => {
        loadComments(item.id);
      });
    } catch (error) {
      console.log("Erro ao buscar notícias:", error);
    }
  };

  // 💬 COMMENTS
  const loadComments = async (newsId: number) => {
    try {
      const res = await fetch(`${COMMENT_API}/${newsId}`);
      const data = await res.json();

      setCommentsList((prev) => ({
        ...prev,
        [newsId]: data,
      }));
    } catch {
      console.log("Erro ao carregar comentários");
    }
  };

  // 🆕 CLASSIFICAÇÃO
  const loadStandings = async () => {
    try {
      const res = await fetch(STANDINGS_API);
      const data = await res.json();
      setStandings(data);
    } catch {
      console.log("Erro ao carregar classificação");
    }
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
    loadStandings(); // 🆕
  }, []);

  // 🔥 CREATE / UPDATE NEWS
  const createNews = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    const res = await fetch(url, {
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

    if (!res.ok) {
      alert("Erro ao salvar notícia");
      return;
    }

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

  // 💬 COMENTAR
  const handleComment = async (newsId: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(COMMENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: comments[newsId],
        news_id: newsId,
      }),
    });

    if (!res.ok) {
      alert("Erro ao comentar");
      return;
    }

    setComments((prev) => ({
      ...prev,
      [newsId]: "",
    }));

    loadComments(newsId);
  };

  // 🆕 ATUALIZAR CLASSIFICAÇÃO
  const updateStanding = async (team: Standing) => {
    const token = localStorage.getItem("token");

    await fetch(`${STANDINGS_API}/${team.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(team),
    });

    loadStandings();
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-10 overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://cdn.meutimao.com.br/_upload/historia/titulos-conquistados/copa_do_brasil_2025.jpg')",
      }}
    >
      <div className="max-w-4xl mx-auto bg-black/90 p-8 rounded-lg text-white">

        <h1 className="text-3xl font-bold mb-6">
          Painel Admin - Corinthians Portal
        </h1>

        {/* FORM */}
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

        {/* NEWS */}
        <h2 className="text-xl mb-4">Lista de Notícias</h2>

        <div className="grid gap-6">

          {news.map((item) => (
            <div key={item.id} className="bg-black border border-gray-700 p-4 rounded">

              <h3 className="text-lg font-bold">{item.title}</h3>

              <img src={item.image_url} className="mt-3 rounded" />

              <p className="mt-3">{item.content}</p>

              <button
                onClick={() => {
                  setEditingId(item.id);
                  setTitle(item.title);
                  setContent(item.content);
                  setImage(item.image_url);
                }}
                className="mt-4 bg-yellow-500 px-4 py-2 rounded mr-2"
              >
                Editar
              </button>

              <button
                onClick={() => deleteNews(item.id)}
                className="mt-4 bg-red-600 px-4 py-2 rounded"
              >
                Excluir
              </button>

              {/* COMENTÁRIOS */}
              <div className="mt-6">

                <textarea
                  className="w-full p-2 rounded text-black"
                  value={comments[item.id] || ""}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [item.id]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => handleComment(item.id)}
                  className="mt-2 bg-blue-500 px-4 py-2 rounded"
                >
                  Comentar
                </button>

                {commentsList[item.id]?.map((c) => (
                  <p key={c.id}>{c.content}</p>
                ))}

              </div>

            </div>
          ))}

        </div>

        {/* 🆕 CLASSIFICAÇÃO */}
        <h2 className="text-xl mt-10 mb-4">
          Editar Classificação (20 times)
        </h2>

        {standings.map((team) => (
          <div key={team.id} className="bg-gray-900 p-4 rounded mb-4">

            <h3 className="font-bold">{team.team_name}</h3>

            <div className="grid grid-cols-4 gap-2 mt-2">

              <input
                type="number"
                value={team.points}
                onChange={(e) =>
                  setStandings((prev) =>
                    prev.map((t) =>
                      t.id === team.id
                        ? { ...t, points: Number(e.target.value) }
                        : t
                    )
                  )
                }
                className="p-2 text-black rounded"
              />

              <input
                type="number"
                value={team.played}
                onChange={(e) =>
                  setStandings((prev) =>
                    prev.map((t) =>
                      t.id === team.id
                        ? { ...t, played: Number(e.target.value) }
                        : t
                    )
                  )
                }
                className="p-2 text-black rounded"
              />

              <input
                type="number"
                value={team.win}
                onChange={(e) =>
                  setStandings((prev) =>
                    prev.map((t) =>
                      t.id === team.id
                        ? { ...t, win: Number(e.target.value) }
                        : t
                    )
                  )
                }
                className="p-2 text-black rounded"
              />

              <input
                type="number"
                value={team.draw}
                onChange={(e) =>
                  setStandings((prev) =>
                    prev.map((t) =>
                      t.id === team.id
                        ? { ...t, draw: Number(e.target.value) }
                        : t
                    )
                  )
                }
                className="p-2 text-black rounded"
              />

            </div>

            <button
              onClick={() => updateStanding(team)}
              className="mt-3 bg-green-500 px-4 py-2 rounded"
            >
              Salvar
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Admin;