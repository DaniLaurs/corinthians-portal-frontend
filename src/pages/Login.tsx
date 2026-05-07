/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      console.log("📤 ENVIANDO LOGIN:", { email, password });

      const res = await fetch("https://corinthians-portal-backend.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 RESPONSE:", res);

      const data = await res.json();

      console.log("📥 STATUS:", res.status);
      console.log("📥 DATA:", data);

      if (!res.ok) {
        console.log("❌ ERRO NO LOGIN:", data);
        alert(data.message || "Erro no login");
        return;
      }

      if (data.token) {
        console.log("🎟️ TOKEN RECEBIDO:", data.token);

        localStorage.setItem("token", data.token);

        const tokenSalvo = localStorage.getItem("token");
        console.log("💾 TOKEN SALVO NO LOCALSTORAGE:", tokenSalvo);

        navigate("/");
      } else {
        console.log("❌ TOKEN NÃO VEIO NA RESPOSTA");
        alert("Token não recebido");
      }

    } catch (error) {
      console.log("🚨 ERRO FETCH:", error);
      alert("Erro ao conectar com servidor");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <form onSubmit={handleLogin} className="bg-gray-900 p-6 rounded flex flex-col gap-4 w-80">

        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          className="p-2 text-black rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="p-2 text-black rounded"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-white text-black p-2 rounded font-bold hover:bg-gray-200 transition">
          Entrar
        </button>

      </form>
    </div>
  );
}

export default Login;