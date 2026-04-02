import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";

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

  const API = "https://corinthians-portal-backend.onrender.com/api/standings";

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
                <tr className={`
                  border-b border-gray-800 hover:bg-gray-900
                  transition-all duration-500
                `}>
               <th className="text-center">Pts</th>
                <th className="text-center">Pts</th>
                <th className="text-center">J</th>
                <th className="text-center">V</th>
                <th className="text-center">E</th>
                <th className="text-center">D</th>
                <th className="text-center">SG</th>
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

                      ${index < 6 ? "bg-green-900/40" : ""}
                      ${index >= table.length - 6 ? "bg-red-900/40" : ""}
                      ${team.team_name
                        .toLowerCase()
                        .includes("corinthians")
                        ? "bg-gray-700 font-bold"
                        : ""}
                    `}
                  >
                    {/* 🔢 POSIÇÃO + VARIAÇÃO */}
                    <td className="flex items-center gap-2">
                     <span
                      className={`
                      text-lg
                        ${getVariation(team, index) === "🔼" ? "animate-bounce text-green-400" : ""}
                        ${getVariation(team, index) === "🔽" ? "animate-bounce text-red-400" : ""}
                          `}
                        >
                        {getVariation(team, index)}
                        </span>

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
                    <td className="text-center font-bold">{team.points}</td>
                    <td className="text-center">{team.played}</td>
                    <td className="text-center">{team.win}</td>
                    <td className="text-center">{team.draw}</td>
                    <td className="text-center">{team.lose}</td>
                    <td className="text-center">{team.goals_diff}</td>
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