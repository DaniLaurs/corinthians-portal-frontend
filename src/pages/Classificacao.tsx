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
  last_position?: number;
  goals_for: number;       // 🔥 gols pró
  goals_against: number;   // 🔥 gols contra
  goals_diff: number;

}

// 🔥 LOGOS MANUAIS
const TEAM_LOGOS: Record<string, string> = {
  corinthians:
    "https://logodetimes.com/times/corinthians/logo-corinthians-256.png",

  "atletico mineiro":
    "https://logodetimes.com/times/atletico-mineiro/logo-atletico-mineiro-256.png",

  internacional:
    "https://logodetimes.com/times/internacional/logo-internacional-256.png",

  santos:
    "https://logodetimes.com/times/santos/logo-santos-256.png",

  remo:
    "https://logodetimes.com/times/remo/logo-remo-256.png",

  mirassol:
    "https://logodetimes.com/times/mirassol/logo-mirassol-256.png",

  chapecoense:
    "https://logodetimes.com/times/chapecoense/logo-chapecoense-256.png",

  gremio:
    "https://logodetimes.com/times/gremio/logo-gremio-256.png",

  botafogo:
    "https://logodetimes.com/times/botafogo/logo-botafogo-256.png",

  flamengo:
    "https://logodetimes.com/times/flamengo/logo-flamengo-256.png",

  palmeiras:
    "https://logodetimes.com/times/palmeiras/logo-palmeiras-256.png",

  vasco:
    "https://logodetimes.com/times/vasco/logo-vasco-256.png",

  bahia:
    "https://logodetimes.com/times/bahia/logo-bahia-256.png",

  cruzeiro:
    "https://logodetimes.com/times/cruzeiro/logo-cruzeiro-256.png",

  fluminense:
    "https://logodetimes.com/times/fluminense/logo-fluminense-256.png",

  sao_paulo:
    "https://logodetimes.com/times/sao-paulo/logo-sao-paulo-256.png",

    "athletico paranaense":"https://logodetimes.com/times/atletico-paranaense/logo-atletico-paranaense-256.png",

    bragantino: "https://logodetimes.com/times/red-bull-bragantino/logo-red-bull-bragantino-256.png",

    coritiba: "https://logodetimes.com/times/coritiba/logo-coritiba-256.png",

    vitoria: "https://logodetimes.com/times/vitoria/logo-vitoria-256.png"
};

// 🔥 NORMALIZA NOMES
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

// 🔥 PEGA LOGO
const getLogo = (team: Team) => {
  if (team.team_logo?.startsWith("http")) {
    return team.team_logo;
  }

  const key = normalize(team.team_name);

  return (
    TEAM_LOGOS[key] ||
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
  );
};

function Classificacao() {
  const [table, setTable] = useState<Team[]>([]);

  const API =
"https://corinthians-portal-backend.onrender.com/api/standings";

  // 🔥 VARIAÇÃO POSIÇÃO
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

              // 🔥 ORDENAÇÃO
            const sorted = data.sort((a: Team, b: Team) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }

        if (b.win !== a.win) {
          return b.win - a.win;
        }

        if (b.goals_diff !== a.goals_diff) {
          return b.goals_diff - a.goals_diff;
        }

        if (b.goals_for !== a.goals_for) {
          return b.goals_for - a.goals_for;
        }

        return a.goals_against - b.goals_against;
      });
            

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
              <tr
                className="
                  border-b border-gray-800
                  hover:bg-gray-900
                  transition-all duration-500
                "
              >
                <th className="text-left py-2">#</th>
                <th className="text-left">Time</th>
                <th className="text-center">Pts</th>
                <th className="text-center">J</th>
                <th className="text-center">V</th>
                <th className="text-center">E</th>
                <th className="text-center">D</th>
                <th className="text-center">GP</th>
                <th className="text-center">GC</th>
                <th className="text-center">SG</th>
                
              </tr>
            </thead>

            <tbody>
              {table.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-4"
                  >
                    Carregando dados...
                  </td>
                </tr>
              ) : (
                table.map((team, index) => (
                  <tr
                    key={team.id}
                    className={`
                      border-b border-gray-800
                      hover:bg-gray-900
                      transition

                      ${index < 6 ? "bg-green-900/40" : ""}
                      ${index >= table.length - 4 ? "bg-red-900/40" : ""}

                      ${
                        team.team_name
                          .toLowerCase()
                          .includes("corinthians")
                          ? "bg-gray-700 font-bold"
                          : ""
                      }
                    `}
                  >
                    {/* POSIÇÃO */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                            text-lg
                            ${
                              getVariation(team, index) === "🔼"
                                ? "animate-bounce text-green-400"
                                : ""
                            }
                            ${
                              getVariation(team, index) === "🔽"
                                ? "animate-bounce text-red-400"
                                : ""
                            }
                          `}
                        >
                          {getVariation(team, index)}
                        </span>

                        {index + 1}
                      </div>
                    </td>

                    {/* TIME */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={getLogo(team)}
                          onError={(e) => {
                            (
                              e.target as HTMLImageElement
                            ).src =
                              "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                          }}
                          className="w-6 h-6 object-contain"
                        />

                        {team.team_name}
                      </div>
                    </td>

                    <td className="text-center font-bold">
                      {team.points}
                    </td>

                    <td className="text-center">
                      {team.played}
                    </td>

                    <td className="text-center">
                      {team.win}
                    </td>

                    <td className="text-center">
                      {team.draw}
                    </td>

                    <td className="text-center">
                      {team.lose}
                    </td>

                    <td className="text-center">
                      {team.goals_for}
                    </td>

                    <td className="text-center">
                      {team.goals_against}
                    </td>

                    
                    <td className="text-center">
                      {team.goals_diff}
                    </td>
                    
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