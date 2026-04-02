export function timeAgo(dateString: string) {
  const now = new Date().getTime();
  const past = new Date(dateString).getTime();

  const diff = Math.floor((now - past) / 1000);

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);

  console.log("⏱️ diff:", diff, "min:", minutes, "h:", hours, "d:", days);

  if (diff < 60) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} minutos`;
  if (hours < 24) return `há ${hours} horas`;
  return `há ${days} dias`;
}