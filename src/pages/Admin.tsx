import { useEffect, useState } from "react";

interface News {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  competition: string;
}

function Admin() {
  const [news, setNews] = useState<News[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [matches, setMatches] = useState<Match[]>([]);
  const [matchForm, setMatchForm] = useState({
    home_team: "",
    away_team: "",
    match_date: "",
    competition: "",
  });
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);

  const API = "https://corinthians-portal-backend.onrender.com/api/news";
  const MATCH_API = "https://corinthians-portal-backend.onrender.com/api/matches";

  const loadNews = async () => {
  const res = await fetch(API);
  const data = await res.json();
  setNews(Array.isArray(data) ? data : data.data || []);
};

const loadMatches = async () => {
  const res = await fetch(MATCH_API);
  const data = await res.json();
  setMatches(Array.isArray(data) ? data : data.data || []);
};

useEffect(() => {
  const fetchData = async () => {
    try {
      const [newsRes, matchesRes] = await Promise.all([
        fetch(API),
        fetch(MATCH_API),
      ]);

      const newsData = await newsRes.json();
      const matchesData = await matchesRes.json();

      setNews(Array.isArray(newsData) ? newsData : newsData.data || []);
      setMatches(Array.isArray(matchesData) ? matchesData : matchesData.data || []);
    } catch (err) {
      console.log("Erro ao carregar dados", err);
    }
  };

  fetchData();
}, []);

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

 const handleMatchSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  const method = editingMatchId ? "PUT" : "POST";
  const url = editingMatchId
    ? `${MATCH_API}/${editingMatchId}`
    : MATCH_API;

  // 🔥 SEPARA AQUI
  const [date, time] = matchForm.match_date.split("T");

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      home_team: matchForm.home_team,
      away_team: matchForm.away_team,
      competition: matchForm.competition,
      date,
      time,
    }),
  });

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

        {/* NEWS */}
        <form onSubmit={createNews} className="flex flex-col gap-3 mb-8">
          <input className="p-2 rounded text-black" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="p-2 rounded text-black" placeholder="Imagem URL" value={image} onChange={(e) => setImage(e.target.value)} />
          <textarea className="p-2 rounded text-black" placeholder="Conteúdo" value={content} onChange={(e) => setContent(e.target.value)} />
          <button className="bg-white text-black py-2 rounded">
            {editingId ? "Atualizar" : "Criar"}
          </button>
        </form>

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
              }} className="bg-yellow-500 px-2 py-1 rounded text-black">
                Editar
              </button>

              <button onClick={() => deleteNews(item.id)} className="bg-red-600 px-2 py-1 rounded">
                Excluir
              </button>
            </div>
          </div>
        ))}

        {/* MATCHES */}
        <h2 className="mt-10 text-xl font-bold">Próximos Jogos</h2>

        <form onSubmit={handleMatchSubmit} className="flex flex-col gap-2 mt-3">
          <input placeholder="Time da casa" className="p-2 text-black rounded"
            value={matchForm.home_team}
            onChange={(e) => setMatchForm({ ...matchForm, home_team: e.target.value })}
          />

          <input placeholder="Time visitante" className="p-2 text-black rounded"
            value={matchForm.away_team}
            onChange={(e) => setMatchForm({ ...matchForm, away_team: e.target.value })}
          />

          <input type="datetime-local" className="p-2 text-black rounded"
            value={matchForm.match_date}
            onChange={(e) => setMatchForm({ ...matchForm, match_date: e.target.value })}
          />

          <input placeholder="Competição" className="p-2 text-black rounded"
            value={matchForm.competition}
            onChange={(e) => setMatchForm({ ...matchForm, competition: e.target.value })}
          />

          <button className="bg-white text-black py-2 rounded">
            {editingMatchId ? "Atualizar Jogo" : "Criar Jogo"}
          </button>
        </form>

        {matches.map((match) => {
          const [date, time] = match.match_date.split("T");

          return (
            <div key={match.id} className="bg-gray-900 p-4 mt-3 rounded">
              <h3>{match.home_team} vs {match.away_team}</h3>
              <p>{match.competition}</p>
              <p>{date} - {time?.slice(0, 5)}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditingMatchId(match.id);
                    setMatchForm({
                      home_team: match.home_team,
                      away_team: match.away_team,
                      competition: match.competition,
                      match_date: match.match_date.slice(0, 16),
                    });
                  }}
                  className="bg-yellow-500 px-2 py-1 rounded text-black"
                >
                  Editar
                </button>

                <button
                  onClick={() => deleteMatch(match.id)}
                  className="bg-red-600 px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Admin;