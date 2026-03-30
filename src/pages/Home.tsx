import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";

import torcida from "../assets/torcida.jpg";
import noticiaImg from "../assets/noticias.jpg";
import Navbar from "../components/Navbar";


function Home() {
  const [news, setNews] = useState([]);

  const API = "http://localhost:3000/api/news";

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setNews(data.data));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* 🔥 destaque principal */}
        {news[0] && (
          <Link to={`/news/${news[0].id}`}>
            <div className="mb-8 cursor-pointer">
              <img src={news[0].image_url} className="w-full rounded" />
              <h1 className="text-3xl font-bold mt-4">{news[0].title}</h1>
            </div>
          </Link>
        )}

        {/* 📰 grid de notícias */}
        <div className="grid md:grid-cols-3 gap-6">
          {news.slice(1).map((item: any) => (
            <Link to={`/news/${item.id}`} key={item.id}>
              <div className="bg-white rounded shadow hover:scale-105 transition">

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