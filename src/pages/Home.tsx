import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Header } from "../components/Header";

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
        // sua API retorna { page, totalPages, totalItems, data: [...] }
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
          {/* TESTE: imagem direta para verificar se o navegador renderiza */}
          <img
            src="https://picsum.photos/800/400"
            style={{ width: "400px", marginBottom: "20px" }}
            alt="teste"
          />

          <h1 className="text-4xl font-bold mb-8">Últimas notícias</h1>

          {/* NOTÍCIA PRINCIPAL */}
          {mainNews && (
            <div className="bg-white text-black rounded-xl overflow-hidden mb-10 shadow-xl">
              <img
                src={mainNews.image_url || noticiaImg}
                alt={mainNews.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">{mainNews.title}</h2>

                <p className="text-lg text-gray-700">{mainNews.content}</p>
              </div>
            </div>
          )}

          {/* OUTRAS NOTÍCIAS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherNews.map((item) => (
              <article
                key={item.id}
                className="bg-white text-black rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={item.image_url || noticiaImg}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>

                  <p className="text-gray-700">{item.content}</p>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}