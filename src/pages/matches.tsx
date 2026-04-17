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

function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const API = "https://corinthians-portal-backend.onrender.com/api/matches";
  const TEAM_API = "https://corinthians-portal-backend.onrender.com/api/teams";

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

      setMatches(Array.isArray(matchesData) ? matchesData : matchesData.data || []);
      setTeams(Array.isArray(teamsData) ? teamsData : teamsData.data || []);
    } catch (err) {
      console.log("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  const getLogo = (teamName: string) => {
    const team = teams.find(
      (t) => t.name === teamName.toLowerCase()
    );

    return team ? team.logo_url : "https://via.placeholder.com/40";
  };

  const now = new Date();

  // ✅ CORRIGIDO
  const upcoming = matches.filter((m) => {
    const [date, time] = m.match_date.split("T");
    const matchDate = new Date(`${date}T${time}`);
    return matchDate > now;
  });

  // ✅ CORRIGIDO
  const finished = matches.filter((m) => {
    const [date, time] = m.match_date.split("T");
    const matchDate = new Date(`${date}T${time}`);
    return matchDate <= now;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {loading && <p className="text-gray-400">Carregando jogos...</p>}

      {!loading && matches.length === 0 && (
        <p className="text-gray-500">Nenhum jogo cadastrado</p>
      )}

      <h1 className="text-3xl font-bold mb-6">Próximos Jogos</h1>

      {upcoming.length === 0 && !loading && (
        <p className="text-gray-400">Nenhum jogo futuro</p>
      )}

      <div className="grid gap-4">
        {upcoming.map((match) => {
          const [date, time] = match.match_date.split("T");

          return (
            <div
              key={match.id}
              className="bg-gray-900 p-4 rounded flex items-center justify-between"
            >

              <div className="flex items-center gap-4">
                <img src={getLogo(match.home_team)} className="w-10 h-10 object-contain" />
                <span className="capitalize">{match.home_team}</span>
              </div>

              <span className="text-gray-400 font-bold">vs</span>

              <div className="flex items-center gap-4">
                <span className="capitalize">{match.away_team}</span>
                <img src={getLogo(match.away_team)} className="w-10 h-10 object-contain" />
              </div>

              {/* ✅ CORRIGIDO AQUI */}
              <div className="text-right">
                <p className="text-sm">
                  {date} - {time?.slice(0, 5)}
                </p>
                <p className="text-xs text-gray-400">
                  {match.competition}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">
        Jogos Finalizados
      </h2>

      {finished.length === 0 && !loading && (
        <p className="text-gray-500">Nenhum jogo finalizado</p>
      )}

      <div className="grid gap-3 opacity-70">
        {finished.map((match) => {
          const [date] = match.match_date.split("T");

          return (
            <div
              key={match.id}
              className="bg-gray-800 p-3 rounded flex justify-between items-center"
            >

              <div className="flex items-center gap-3">
                <img src={getLogo(match.home_team)} className="w-6 h-6 object-contain" />
                <span className="capitalize">
                  {match.home_team} vs {match.away_team}
                </span>
                <img src={getLogo(match.away_team)} className="w-6 h-6 object-contain" />
              </div>

              {/* ✅ CORRIGIDO AQUI */}
              <span className="text-sm">
                {date}
              </span>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Matches;