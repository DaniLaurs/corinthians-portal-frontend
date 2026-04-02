import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Header } from "../components/Header";
import torcida from "../assets/torcida.jpg";

interface News {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

export function NewsPage() {

  const { id } = useParams();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    api.get(`/news/${id}`).then((response:any) => {
      setNews(response.data);
    });
  }, [id]);

  if (!news) {
    return <p className="text-white p-10">Carregando...</p>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${torcida})` }}
    >
      <div className="min-h-screen bg-black/80">

        <Header />

        <main className="max-w-4xl mx-auto p-6 text-white">

          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-96 object-cover rounded-xl mb-6"
          />

          <h1 className="text-4xl font-bold mb-6">
            {news.title}
          </h1>

          <p className="text-lg leading-relaxed">
            {news.content}
          </p>

        </main>

      </div>
    </div>
  );
}