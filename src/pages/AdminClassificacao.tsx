import { useEffect, useState } from "react";

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

function AdminClassificacao() {
  const [standings, setStandings] = useState<Standing[]>([]);

  const [form, setForm] = useState({
    team_name: "",
    points: 0,
    played: 0,
    win: 0,
    draw: 0,
    lose: 0,
    goals_diff: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const API =
    "https://corinthians-portal-backend.onrender.com/api/standings";

  // 🔥 PRIMEIRO DECLARA A FUNÇÃO
  const loadStandings = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      // 🔥 ORDENA PELOS PONTOS
      const sorted = (
        Array.isArray(data) ? data : data.data || []
      ).sort((a: Standing, b: Standing) => b.points - a.points);

      setStandings(sorted);

    } catch (error) {
      console.log("Erro ao carregar classificação", error);
    }
  };

  // 🔥 DEPOIS USA NO useEffect
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const sorted = (
        Array.isArray(data) ? data : data.data || []
      ).sort((a: Standing, b: Standing) => b.points - a.points);

      setStandings(sorted);

    } catch (error) {
      console.log("Erro ao carregar classificação", error);
    }
  };

  fetchData();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";

    const url = editingId
      ? `${API}/${editingId}`
      : API;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Erro ao salvar");
      return;
    }

    setForm({
      team_name: "",
      points: 0,
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals_diff: 0,
    });

    setEditingId(null);

    loadStandings();
  };

  const deleteTeam = async (id: number) => {
    const token = localStorage.getItem("token");

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadStandings();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Admin - Classificação
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mb-6"
        >

          <input
            placeholder="Time"
            className="p-2 text-black rounded"
            value={form.team_name}
            onChange={(e) =>
              setForm({
                ...form,
                team_name: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Pontos"
            className="p-2 text-black rounded"
            value={form.points}
            onChange={(e) =>
              setForm({
                ...form,
                points: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Jogos"
            className="p-2 text-black rounded"
            value={form.played}
            onChange={(e) =>
              setForm({
                ...form,
                played: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Vitórias"
            className="p-2 text-black rounded"
            value={form.win}
            onChange={(e) =>
              setForm({
                ...form,
                win: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Empates"
            className="p-2 text-black rounded"
            value={form.draw}
            onChange={(e) =>
              setForm({
                ...form,
                draw: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Derrotas"
            className="p-2 text-black rounded"
            value={form.lose}
            onChange={(e) =>
              setForm({
                ...form,
                lose: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Saldo de gols"
            className="p-2 text-black rounded"
            value={form.goals_diff}
            onChange={(e) =>
              setForm({
                ...form,
                goals_diff: Number(e.target.value),
              })
            }
          />

          <button className="bg-white text-black py-2 rounded">
            {editingId ? "Atualizar" : "Adicionar"}
          </button>

        </form>

        {/* LISTA */}
        {standings.map((team, index) => (
          <div
            key={team.id}
            className="bg-gray-900 p-4 mb-3 rounded"
          >

            <h3 className="font-bold">
              #{index + 1} - {team.team_name}
            </h3>

            <p>Pontos: {team.points}</p>
            <p>Jogos: {team.played}</p>
            <p>Vitórias: {team.win}</p>
            <p>Empates: {team.draw}</p>
            <p>Derrotas: {team.lose}</p>
            <p>Saldo: {team.goals_diff}</p>

            <div className="flex gap-2 mt-2">

              <button
                onClick={() => {
                  setEditingId(team.id);

                  setForm({
                    team_name: team.team_name,
                    points: team.points,
                    played: team.played,
                    win: team.win,
                    draw: team.draw,
                    lose: team.lose,
                    goals_diff: team.goals_diff,
                  });
                }}
                className="bg-yellow-500 px-2 py-1 rounded text-black"
              >
                Editar
              </button>

              <button
                onClick={() => deleteTeam(team.id)}
                className="bg-red-600 px-2 py-1 rounded"
              >
                Excluir
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminClassificacao;