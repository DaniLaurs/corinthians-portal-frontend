import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Team {
  id: number;
  team_name: string;
  team_logo: string;
  points: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals_diff: number;
  last_position?: number; // 🆕 variação
}

function Classificacao() {
  const [table, setTable] = useState<Team[]>([]);

  const API = "http://localhost:3000/api/standings";

  // 🔥 VARIAÇÃO (🔼 🔽)
  const getVariation = (team: Team, index: number) => {
    const current = index + 1;
    const last = team.last_position;

    if (!last) return "⏺️";
    if (current < last) return "🔼";
    if (current > last) return "🔽";
    return "➖";
  };

  useEffect(() => {
    const loadTable = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();

        // 🔥 ordena por pontos automaticamente
        const sorted = data.sort((a: Team, b: Team) => b.points - a.points);

        setTable(sorted);
      } catch {
        console.log("Erro ao buscar classificação");
      }
    };

    loadTable();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white overflow-y-auto">

      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          Classificação Brasileirão
        </h1>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th>#</th>
                <th>Time</th>
                <th>Pts</th>
                <th>J</th>
                <th>V</th>
                <th>E</th>
                <th>D</th>
                <th>SG</th>
              </tr>
            </thead>

            <tbody>
              {table.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Carregando dados...
                  </td>
                </tr>
              ) : (
                table.map((team, index) => (
                  <tr
                    key={team.id}
                    className={`
                      border-b border-gray-800 hover:bg-gray-900 transition

                      ${index < 4 ? "bg-green-900/40" : ""}
                      ${index >= table.length - 4 ? "bg-red-900/40" : ""}
                      ${team.team_name
                        .toLowerCase()
                        .includes("corinthians")
                        ? "bg-gray-700 font-bold"
                        : ""}
                    `}
                  >
                    {/* 🔢 POSIÇÃO + VARIAÇÃO */}
                    <td className="flex items-center gap-2">
                      {getVariation(team, index)}
                      {index + 1}
                    </td>

                    {/* 🛡️ TIME + ESCUDO */}
                    <td className="flex items-center gap-2 py-2">
                      {team.team_logo && (
                        <img
                          src={team.team_logo}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      {team.team_name}
                    </td>

                    <td className="font-bold">{team.points}</td>
                    <td>{team.played}</td>
                    <td>{team.win}</td>
                    <td>{team.draw}</td>
                    <td>{team.lose}</td>
                    <td>{team.goals_diff}</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default Classificacao;