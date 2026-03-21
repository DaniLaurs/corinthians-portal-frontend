import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";

import torcida from "../assets/torcida.jpg";
import noticiaImg from "../assets/noticias.jpg";

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string | null;
  created_at?: string;
}

export function Home() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    api
      .get("/news")
      .then((response) => {
        setNews(response.data.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar notícias:", error);
      });
  }, []);

  const mainNews = news[0];
  const otherNews = news.slice(1);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${torcida})` }}
    >
      <div className="min-h-screen bg-black/80">
        <Header />

        <main className="max-w-6xl mx-auto p-6 text-white">
          <h1 className="text-4xl font-bold mb-8">Últimas notícias</h1>

          {/* NOTÍCIA PRINCIPAL */}
          {mainNews && (
            <Link to={`/news/${mainNews.id}`}>
              <div className="bg-white text-black rounded-xl overflow-hidden mb-10 shadow-xl hover:scale-[1.01] transition cursor-pointer">

                <img
                  src={mainNews.image_url || noticiaImg}
                  alt={mainNews.title}
                  className="w-full h-72 object-cover"
                />

                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {mainNews.title}
                  </h2>

                  <p className="text-lg text-gray-700 line-clamp-3">
                    {mainNews.content}
                  </p>
                </div>

              </div>
            </Link>
          )}

          {/* OUTRAS NOTÍCIAS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {otherNews.map((item) => (
              <Link key={item.id} to={`/news/${item.id}`}>
                <article className="bg-white text-black rounded-xl overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer">

                  <img
                    src={item.image_url || noticiaImg}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-6">

                    <h3 className="text-xl font-bold mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-700 line-clamp-3">
                      {item.content}
                    </p>

                  </div>

                </article>
              </Link>
            ))}

          </div>
        </main>
      </div>
    </div>
  );
}