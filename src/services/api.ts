
export const API_URL = "https://corinthians-portal-backend.onrender.com";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 🔥 tenta 2 vezes (resolve problema do Render dormindo)
  for (let i = 0; i < 2; i++) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      return await response.json();
    } catch (error) {
      if (i === 1) throw error;

      // espera 2 segundos antes de tentar de novo
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
}

