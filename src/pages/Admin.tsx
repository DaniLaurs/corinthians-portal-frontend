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

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  competition: string;
}

function Admin() {
  // NEWS
  const [news, setNews] = useState<News[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // COMMENTS
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [commentsList, setCommentsList] = useState<{ [key: number]: Comment[] }>({});

  // STANDINGS
  const [standings, setStandings] = useState<Standing[]>([]);

  // MATCHES 🔥
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchForm, setMatchForm] = useState({
    home_team: "",
    away_team: "",
    match_date: "",
    competition: "",
  });
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);

  const API = "https://corinthians-portal-backend.onrender.com/api/news";
  const COMMENT_API = "https://corinthians-portal-backend.onrender.com/api/comments";
  const STANDINGS_API = "https://corinthians-portal-backend.onrender.com/api/standings";
  const MATCH_API = "https://corinthians-portal-backend.onrender.com/api/matches";

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
    loadStandings();
    loadMatches();
  }, []);

  // 🔥 NEWS
  const loadNews = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const list = Array.isArray(data) ? data : data.data || [];
      setNews(list);

      list.forEach((item: News) => {
        loadComments(item.id);
      });
    } catch {
      console.log("Erro ao buscar notícias");
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

  // 🏆 STANDINGS
  const loadStandings = async () => {
    try {
      const res = await fetch(STANDINGS_API);
      const data = await res.json();
      setStandings(Array.isArray(data) ? data : data.data || []);
    } catch {
      console.log("Erro ao carregar classificação");
    }
  };

  // 📅 MATCHES
  const loadMatches = async () => {
    try {
      const res = await fetch(MATCH_API);
      const data = await res.json();
      setMatches(Array.isArray(data) ? data : data.data || []);
    } catch {
      console.log("Erro ao carregar jogos");
    }
  };

  // CREATE / UPDATE NEWS
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

  // 💬 COMMENT
  const handleComment = async (newsId: number) => {
    const token = localStorage.getItem("token");

    if (!comments[newsId]) return;

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

  // 🏆 UPDATE STANDING
  const updateStanding = async (team: Standing) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${STANDINGS_API}/${team.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(team),
      });

      loadStandings();
    } catch {
      alert("Erro ao atualizar");
    }
  };

  // 📅 CREATE / UPDATE MATCH
  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const method = editingMatchId ? "PUT" : "POST";
    const url = editingMatchId
      ? `${MATCH_API}/${editingMatchId}`
      : MATCH_API;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(matchForm),
    });

    if (!res.ok) {
      alert("Erro ao salvar jogo");
      return;
    }

    setMatchForm({
      home_team: "",
      away_team: "",
      match_date: "",
      competition: "",
    });

    setEditingMatchId(null);
    loadMatches();
  };

  const deleteMatch = async (id: number) => {
    const token = localStorage.getItem("token");

    await fetch(`${MATCH_API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadMatches();
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Painel Admin</h1>

        {/* FORM NEWS */}
        <form onSubmit={createNews} className="flex flex-col gap-3 mb-8">
          <input className="p-2 rounded text-black" placeholder="Título"
            value={title} onChange={(e) => setTitle(e.target.value)} />

          <input className="p-2 rounded text-black" placeholder="Imagem URL"
            value={image} onChange={(e) => setImage(e.target.value)} />

          <textarea className="p-2 rounded text-black" placeholder="Conteúdo"
            value={content} onChange={(e) => setContent(e.target.value)} />

          <button className="bg-white text-black py-2 rounded">
            {editingId ? "Atualizar" : "Criar"}
          </button>
        </form>

        {/* NEWS LIST */}
        {news.map((item) => (
          <div key={item.id} className="bg-gray-900 p-4 mb-4 rounded">
            <h2 className="font-bold">{item.title}</h2>
            <img src={item.image_url} className="mt-2 rounded" />
            <p>{item.content}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => {
                setEditingId(item.id);
                setTitle(item.title);
                setContent(item.content);
                setImage(item.image_url);
              }} className="bg-yellow-500 px-2 py-1 rounded text-black">Editar</button>

              <button onClick={() => deleteNews(item.id)}
                className="bg-red-600 px-2 py-1 rounded">Excluir</button>
            </div>
          </div>
        ))}

        {/* MATCHES 🔥 */}
        <h2 className="mt-10 text-xl font-bold">Próximos Jogos</h2>

        <form onSubmit={handleMatchSubmit} className="flex flex-col gap-2 mt-3">
          <input placeholder="Time da casa" className="p-2 text-black rounded"
            value={matchForm.home_team}
            onChange={(e) => setMatchForm({ ...matchForm, home_team: e.target.value })} />

          <input placeholder="Time visitante" className="p-2 text-black rounded"
            value={matchForm.away_team}
            onChange={(e) => setMatchForm({ ...matchForm, away_team: e.target.value })} />

          <input type="datetime-local" className="p-2 text-black rounded"
            value={matchForm.match_date}
            onChange={(e) => setMatchForm({ ...matchForm, match_date: e.target.value })} />

          <input placeholder="Competição" className="p-2 text-black rounded"
            value={matchForm.competition}
            onChange={(e) => setMatchForm({ ...matchForm, competition: e.target.value })} />

          <button className="bg-white text-black py-2 rounded">
            {editingMatchId ? "Atualizar Jogo" : "Criar Jogo"}
          </button>
        </form>

        {matches.map((match) => (
          <div key={match.id} className="bg-gray-900 p-4 mt-3 rounded">
            <h3>{match.home_team} vs {match.away_team}</h3>
            <p>{new Date(match.match_date).toLocaleString()}</p>
            <p>{match.competition}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => {
                setEditingMatchId(match.id);
                setMatchForm(match);
              }} className="bg-yellow-500 px-2 py-1 rounded text-black">Editar</button>

              <button onClick={() => deleteMatch(match.id)}
                className="bg-red-600 px-2 py-1 rounded">Excluir</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Admin;