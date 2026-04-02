import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";

export default function Profile() {
  const token = localStorage.getItem("token");

  const getUser = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const user = getUser();

  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !token) return;

    // 💬 comentários
    fetch(`http://localhost:3000/api/comments/user/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
     .then(data => {
  console.log("LIKES DATA:", data);

  if (Array.isArray(data)) {
    setLikes(data);
  } else {
    setLikes([]); // 🔥 evita crash
  }
});

    // ❤️ curtidas
    fetch(`http://localhost:3000/api/likes/user/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
   .then(res => res.json())
   .then(data => {
  console.log("COMMENTS DATA:", data);

  if (Array.isArray(data)) {
    setComments(data);
  } else {
    setComments([]);
  }
});

  }, [user, token]);

  if (!user) {
    return <p className="text-center mt-10">Faça login</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">👤 Perfil</h1>

        <div className="bg-gray-900 p-6 rounded-lg shadow">
          <p className="text-lg">
            <strong>Nome:</strong> {user.name}
          </p>

          <p className="text-gray-400 mt-2">
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {/* 💬 COMENTÁRIOS */}
        <h2 className="mt-6 text-xl font-bold">💬 Meus comentários</h2>

        {comments.length === 0 ? (
          <p className="text-gray-400">Nenhum comentário</p>
        ) : (
          comments.map((c: any) => (
            <div key={c.id} className="bg-gray-800 p-3 mt-2 rounded">
              <p>{c.content}</p>
              <span className="text-xs text-gray-400">{c.title}</span>
            </div>
          ))
        )}

        {/* ❤️ CURTIDAS */}
        <h2 className="mt-6 text-xl font-bold">❤️ Minhas curtidas</h2>

        {likes.length === 0 ? (
          <p className="text-gray-400">Nenhuma curtida</p>
        ) : (
          likes.map((l: any) => (
            <div key={l.id} className="bg-gray-800 p-3 mt-2 rounded">
              <p>{l.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}