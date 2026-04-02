import Navbar from "../components/NavBar";

const titulos = [
  {
    name: "Libertadores",
    year: "2012",
    image: "https://down-br.img.susercontent.com/file/836958df199c97bafee333161026a020",
  },
  {
    name: "Mundial de Clubes",
    year: "2000 e 2012",
    image: "https://i.pinimg.com/736x/3e/46/e4/3e46e4069b1016616293b07a7402a17a.jpg",
  },
  {
    name: "Brasileirão",
    year: "1990, 1998, 1999, 2005, 2011, 2015 e 2017",
    image: "https://www.polemicaparaiba.com.br/wp-content/uploads/2017/02/tr%C3%B3feu-brasileir%C3%A3o-chevrolet.jpg",
  },
  {
    name: "Paulistão",
    year: " 1914, 1916, 1922, 1923, 1924, 1928, 1929, 1930, 1937, 1938,1939, 1941,1951, 1952, 1954, 1977, 1979, 1982, 1983, 1988, 1995, 1997, 1999, 2001, 2003, 2009, 2013, 2017, 2018, 2019 e 2025.",
    image: "https://www.acidadeon.com/ribeiraopreto/wp-content/uploads/sites/3/2024/03/AnyConv.com__paulistao.webp",
  },

  {
    name: "Copa do Brasil",
    year: "1995, 2002, 2009 e 2025",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CopadoBrasil2013-.png/960px-CopadoBrasil2013-.png"
  },

  {
    name:"Supercopa do Brasil",
    year:"1991 e 2026",
    image: "https://storage.googleapis.com/bucket.timesbrasil.com.br/sites/2025/12/2f3b1a3a-51109294353_8903c8c4e8_o.webp"
  },

  {
    name: "Recopa Sul-Americana",
    year:"2013",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwZ0JKapgMTxTVEJZ4-nkNexfR4jyjN5xADQ&s"
  },

  {
    name: "Torneio Rio-São Paulo",
    year:"1950, 1953, 1954, 1966 e 2002",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUT49QFEjohMy4_3zkCNF5kO280C9yIzMgXA&s"
  }
];

export default function Titulos() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">🏆 Títulos do Corinthians</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {titulos.map((title, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow hover:scale-105 transition"
            >
              <img
                src={title.image}
                alt={title.name}
                className="h-32 mx-auto object-contain"
              />

              <h2 className="text-xl font-semibold mt-4 text-center">
                {title.name}
              </h2>

              <p className="text-gray-500 text-center">{title.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}