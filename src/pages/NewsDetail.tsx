import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { timeAgo } from "../utils/timeAgo";

interface News {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at?: string;
}

interface Comment {
  id: number;
  content: string;
  created_at?: string;
  name?: string;
}

function NewsDetail() {
  const { id } = useParams();

  const [news, setNews] = useState<News | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  console.log("DATA:", news?.created_at);

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const API = "http://localhost:3000/api/news";
  const COMMENT_API = "http://localhost:3000/api/comments";

  // 📰 carregar notícia
  const loadNews = async () => {
    try {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();
      setNews(data);
    } catch {
      console.log("Erro ao buscar notícia");
    }
  };

  // 💬 carregar comentários
  const loadComments = async () => {
    try {
      const res = await fetch(`${COMMENT_API}/${id}`);
      const data = await res.json();
      setComments(data);
    } catch {
      console.log("Erro ao carregar comentários");
    }
  };

  // 👍 total de likes
  const loadLikes = async () => {
    const res = await fetch(`http://localhost:3000/api/likes/${id}`);
    const data = await res.json();
    setLikes(data.total);
  };

  // 👍 se usuário curtiu
  const checkLike = async () => {
 const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ news_id: id }),
    });


    const data = await res.json();
    setLiked(data.liked);
  };

  useEffect(() => {
    loadNews();
    loadComments();
    loadLikes();
    checkLike();
  }, [id]);

  // 💬 comentar
  const handleComment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado");
      return;
    }

    if (!newComment.trim()) {
      alert("Digite um comentário");
      return;
    }

    const res = await fetch(COMMENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: newComment,
        news_id: Number(id),
      }),
    });

    if (!res.ok) {
      alert("Erro ao comentar");
      return;
    }

    setNewComment("");
    loadComments();
  };

  // 👍 curtir
  const handleLike = async () => {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    if (!token) {
      alert("Faça login para curtir");
      return;
    }

    const res = await fetch("https://corinthians-portal-backend.onrender.com/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        news_id: Number(id),
      }),
    });

    const data = await res.json();

    setLiked(data.liked);
    loadLikes();
  };

  // ⛔ loading
  if (!news)
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p>Carregando notícia...</p>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="max-w-3xl mx-auto bg-white p-8 mt-6 rounded shadow">

        {/* 📰 TÍTULO */}
        <h1 className="text-4xl font-bold mb-3 text-black">
          {news.title}
        </h1>

            {/* 📅 DATA */}
           {news.created_at && (
          <p>{timeAgo(news.created_at)}</p>
      )}

        {/* 🖼️ IMAGEM */}
        <img
          src={news.image_url}
          className="w-full rounded mb-6"
        />

        {/* 📄 CONTEÚDO */}
        <p className="text-gray-800 leading-relaxed text-lg">
          {news.content}
        </p>

        {/* 👍 LIKE */}
        <div className="mt-6 flex items-center gap-4">

          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded flex items-center gap-2 transition
              ${liked ? "bg-red-600 text-white" : "bg-gray-200 text-black"}
            `}
          >
            👍 {liked ? "Curtido" : "Curtir"}
          </button>

          <span className="text-gray-600 font-semibold">
            {likes} curtidas
          </span>

        </div>

        {/* 💬 COMENTÁRIOS */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-4 text-black">
            Comentários
          </h2>

          {/* INPUT */}
          <div className="flex flex-col gap-3">
            <textarea
              className="w-full p-3 border rounded text-black"
              placeholder="Escreva seu comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <button
              onClick={handleComment}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Comentar
            </button>
          </div>

          {/* LISTA */}
          <div className="mt-8 space-y-4">

            {comments.length === 0 && (
              <p className="text-gray-500">
                Nenhum comentário ainda...
              </p>
            )}

            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-100 p-4 rounded border"
              >
                <div className="flex items-center gap-3 mb-2">

                  {/* AVATAR */}
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-black">
                      {c.name || "Usuário"}
                    </p>

                    <p className="text-xs text-gray-500">
                     {c.created_at ? timeAgo(c.created_at) : ""}
                   </p>
                  </div>

                </div>

                <p className="text-black">{c.content}</p>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

export default NewsDetail;