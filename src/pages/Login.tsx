import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await fetch("https://corinthians-portal-backend.onrender.com/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } else {
      alert("Erro no login");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <form onSubmit={handleLogin} className="bg-gray-900 p-6 rounded flex flex-col gap-4">

        <h2 className="text-xl font-bold">Login</h2>

        <input
          className="p-2 text-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="p-2 text-black"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-white text-black p-2 rounded">
          Entrar
        </button>

      </form>
    </div>
  );
}

export default Login;