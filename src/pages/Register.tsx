import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();

    await fetch("http://localhost:3000/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    alert("Cadastro realizado!");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <form onSubmit={handleRegister} className="bg-gray-900 p-6 rounded flex flex-col gap-4">

        <h2 className="text-xl font-bold">Cadastro</h2>

        <input
          className="p-2 text-black"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
        />

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
          Cadastrar
        </button>

      </form>
    </div>
  );
}

export default Register;