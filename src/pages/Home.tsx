import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

interface News {
  id: number;
  title: string;
  image_url: string;
}

function Home() {
  const [news, setNews] = useState<News[]>([]);

  const API = "http://localhost:3000/api/news";

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();

        setNews(data.data || []);
      } catch (error) {
        console.log("Erro ao carregar notícias");
      }
    };

    loadNews();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* 🔥 destaque principal */}
        {news[0] && (
          <Link to={`/news/${news[0].id}`}>
            <div className="mb-8 cursor-pointer hover:scale-[1.01] transition">
              <img src={news[0].image_url} className="w-full rounded" />
              <h1 className="text-3xl font-bold mt-4">{news[0].title}</h1>
            </div>
          </Link>
        )}

        {/* 📰 grid de notícias */}
        <div className="grid md:grid-cols-3 gap-6">
          {news.slice(1).map((item) => (
            <Link to={`/news/${item.id}`} key={item.id}>
              <div className="bg-gray-900 rounded shadow hover:scale-105 transition">

                <img src={item.image_url} className="rounded-t" />

                <div className="p-3">
                  <h2 className="font-bold">{item.title}</h2>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;