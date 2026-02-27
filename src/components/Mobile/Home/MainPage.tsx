import { useNavigate } from "react-router-dom";
import CardOne from "../CardsMobile/CardOne";
import CardTwo from "../CardsMobile/Cardtwo";

function Main() {
  const navigate=useNavigate()
  return (
    <div className=" bg-[#121212] overflow-y-scroll text-white font-sans relative overflow-x-hidden">

      {/* 1. Header Gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-[#1e1e1e] to-[#121212] pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <main className="relative z-10 px-4 py-5 pb-44">

        <h2 className="text-xl font-bold mb-4 text-white/90">meye mizik semen lan</h2>
        {/* 2. RECENTLY PLAYED (Ti bwat yo ak imaj) */}
        <section className="grid grid-cols-2 gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[#282828] hover:bg-[#3e3e3e] transition-colors rounded-[4px] flex items-center gap-3 overflow-hidden cursor-pointer h-14"
            >
              <img
                src={`https://picsum.photos/seed/${i + 10}/100/100`}
                alt="Playlist Cover"
                className="w-14 h-14 object-cover shrink-0 shadow-lg"
              />
              <span className="text-[11px] font-bold truncate pr-2">Mizik Ayisyen #{i}</span>
            </div>
          ))}
        </section>
        <CardOne />
        <CardTwo />

        {/* 4. ATIS YO (Imaj ronn - Avatar) */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 px-1 text-white/90">Atis ou pi renmen</h2>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[110px] flex flex-col items-center">
                <div className="w-24 h-24 rounded-full mb-2 overflow-hidden shadow-2xl border border-white/5">
                  <img
                  onClick={()=>navigate("artist")}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`}
                    alt="Artist Avatar"
                    className="w-full h-full object-cover bg-[#282828]"
                  />
                </div>
                <span className="text-[12px] font-bold text-center text-white/80">Atis #{i}</span>
              </div>
            ))}
          </div>
        </section>
        <CardTwo />
        <CardTwo />

        {/* TÈKS LOREM POU SCROLL */}
        <div className="mt-12 px-1 text-[#b3b3b3] text-sm space-y-6 border-t border-white/5 pt-8">
          <h2 className="text-white font-bold text-lg">Konsènan pwojè H-MIZIK</h2>
          <p>
            H-MIZIK se platfòm ou pou dekouvri pi bon son nan Karayib la. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
         
        </div>

      </main>
    </div>
  );
}

export default Main;