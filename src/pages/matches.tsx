import { useEffect, useState } from "react";

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  competition: string;
}

interface Team {
  id: number;
  name: string;
  logo_url: string;
}

const TEAM_LOGOS: Record<string, string> = {
  // Brasileiros
  corinthians:
    "https://logodetimes.com/times/corinthians/logo-corinthians-256.png",

  flamengo:
    "https://logodetimes.com/times/flamengo/logo-flamengo-256.png",

  palmeiras:
    "https://logodetimes.com/times/palmeiras/logo-palmeiras-256.png",

  vasco:
    "https://logodetimes.com/times/vasco/logo-vasco-256.png",

  "vasco da gama":
    "https://logodetimes.com/times/vasco/logo-vasco-256.png",

  "atletico mg":
    "https://logodetimes.com/times/atletico-mineiro/logo-atletico-mineiro-256.png",

  "atletico mineiro":
    "https://logodetimes.com/times/atletico-mineiro/logo-atletico-mineiro-256.png",

  "sao paulo":
    "https://logodetimes.com/times/sao-paulo/logo-sao-paulo-256.png",

  gremio:
    "https://logodetimes.com/times/gremio/logo-gremio-256.png",

  internacional:
    "https://logodetimes.com/times/internacional/logo-internacional-256.png",

  botafogo:
    "https://logodetimes.com/times/botafogo/logo-botafogo-256.png",

  bahia:
    "https://logodetimes.com/times/bahia/logo-bahia-256.png",

  cruzeiro:
    "https://logodetimes.com/times/cruzeiro/logo-cruzeiro-256.png",

  fluminense:
    "https://logodetimes.com/times/fluminense/logo-fluminense-256.png",

  santos:
    "https://logodetimes.com/times/santos/logo-santos-256.png",

  vitoria:
    "https://logodetimes.com/times/vitoria/logo-vitoria-256.png",

  juventude:
    "https://logodetimes.com/times/juventude/logo-juventude-256.png",

  bragantino:
    "https://logodetimes.com/times/bragantino/logo-bragantino-256.png",

  barra:
    "https://logodetimes.com/times/barra/logo-barra-256.png",

  // Sul-americanos
  penarol:
    "https://logodetimes.com/times/penarol/logo-penarol-256.png",

  "boca juniors":
    "https://logodetimes.com/times/club-atletico-boca-juniors/club-atletico-boca-juniors-256.png",

  "independiente santa fe":
    "https://logodetimes.com/times/santa-fe/logo-santa-fe-256.png",

  "independiente del valle":
    "https://logodetimes.com/times/del-valle/logo-valle-256.png",

  "estudiantes de la plata":
    "https://logodetimes.com/times/estudiantes/logo-estudiantes-256.png",

  "independiente rivadavia":
    "https://logodetimes.com/times/independiente-rivadavia/logo-independiente-rivadavia-256.png",

  platense:
    "https://logodetimes.com/times/platense/logo-platense-256.png",

  "rosario central":
    "https://logodetimes.com/times/rosario-central/logo-rosario-central-256.png",

  lanus:
    "https://logodetimes.com/times/lanus/logo-lanus-256.png",

  nacional:
    "https://logodetimes.com/times/nacional-uruguai/logo-nacional-uruguai-256.png",

  "ldu quito":
    "https://logodetimes.com/times/ldu-liga-de-quito/logo-ldu-liga-de-quito-256.png",

  "barcelona de guayaquil":
    "https://logodetimes.com/times/barcelona/logo-barcelona-256.png",

  junior:
    "https://logodetimes.com/times/junior/logo-junior-256.png",

  "independiente medellin":
    "https://logodetimes.com/times/independiente-medellin/logo-independiente-medellin-256.png",

  libertad:
    "https://logodetimes.com/times/libertad/logo-libertad-256.png",
};

// 🔥 NORMALIZA nomes
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const API =
    "https://corinthians-portal-backend.onrender.com/api/matches";

  const TEAM_API =
    "https://corinthians-portal-backend.onrender.com/api/teams";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [matchesRes, teamsRes] = await Promise.all([
        fetch(API),
        fetch(TEAM_API),
      ]);

      const matchesData = await matchesRes.json();
      const teamsData = await teamsRes.json();

      setMatches(
        Array.isArray(matchesData)
          ? matchesData
          : matchesData.data || []
      );

      setTeams(
        Array.isArray(teamsData)
          ? teamsData
          : teamsData.data || []
      );
    } catch (err) {
      console.log("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  const getLogo = (teamName: string): string => {
    const key = normalize(teamName);

    console.log("🔎 procurando:", key);

    // 🔥 procura no banco primeiro
    const team = teams.find(
      (t) => normalize(t.name) === key
    );

    console.log("📦 encontrado:", team);

    if (team?.logo_url) {
      return team.logo_url;
    }

    // 🔥 fallback manual
    if (TEAM_LOGOS[key]) {
      return TEAM_LOGOS[key];
    }

    // 🔥 logo padrão
    return "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
  };

  // 🔥 próximos jogos
  const upcoming = matches.filter((m) => {
    return m.match_date > new Date().toISOString();
  });

  // 🔥 jogos finalizados
  const finished = matches.filter((m) => {
    return m.match_date <= new Date().toISOString();
  });

  const formatDateBR = (iso: string) => {
    const date = new Date(iso);

    return date.toLocaleDateString("pt-BR");
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {loading && (
        <p className="text-gray-400">
          Carregando jogos...
        </p>
      )}

      {!loading && matches.length === 0 && (
        <p className="text-gray-500">
          Nenhum jogo cadastrado
        </p>
      )}

      <h1 className="text-3xl font-bold mb-6">
        Próximos Jogos
      </h1>

      {upcoming.length === 0 && !loading && (
        <p className="text-gray-400">
          Nenhum jogo futuro
        </p>
      )}

      <div className="grid gap-4">
        {upcoming.map((match) => (
          <div
            key={match.id}
            className="bg-gray-900 p-4 rounded flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={getLogo(match.home_team)}
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src =
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                }}
                className="w-10 h-10 object-contain"
              />

              <span className="capitalize">
                {match.home_team}
              </span>
            </div>

            <span className="text-gray-400 font-bold">
              vs
            </span>

            <div className="flex items-center gap-4">
              <span className="capitalize">
                {match.away_team}
              </span>

              <img
                src={getLogo(match.away_team)}
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src =
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                }}
                className="w-10 h-10 object-contain"
              />
            </div>

            <div className="text-right">
              <p className="text-sm">
                {formatDateBR(match.match_date)} -{" "}
                {formatTime(match.match_date)}
              </p>

              <p className="text-xs text-gray-400">
                {match.competition}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">
        Jogos Finalizados
      </h2>

      {finished.length === 0 && !loading && (
        <p className="text-gray-500">
          Nenhum jogo finalizado
        </p>
      )}

      <div className="grid gap-3 opacity-70">
        {finished.map((match) => (
          <div
            key={match.id}
            className="bg-gray-800 p-3 rounded flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={getLogo(match.home_team)}
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src =
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                }}
                className="w-6 h-6 object-contain"
              />

              <span className="capitalize">
                {match.home_team} vs{" "}
                {match.away_team}
              </span>

              <img
                src={getLogo(match.away_team)}
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src =
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                }}
                className="w-6 h-6 object-contain"
              />
            </div>

            <span className="text-sm">
              {formatDateBR(match.match_date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches;