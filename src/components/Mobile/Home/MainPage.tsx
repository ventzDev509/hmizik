import { useNavigate } from "react-router-dom";// 1. Import context la
import CardOne from "../CardsMobile/CardOne";
import CardTwo from "../CardsMobile/Cardtwo";
import { useTracks } from "../../../context/TrackContext";
import TradingTrack from "../CardsMobile/TradSong";
import { DownloadCloud } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

function Main() {
  const navigate = useNavigate();
  const { trendingTracks } = useTracks();
  const { isInstallable, installApp } = usePWA();


  return (
    <div className="bg-[#121212] min-h-screen overflow-y-scroll text-white font-sans relative overflow-x-hidden">

      {/* 1. Header Gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-[#1e1e1e] to-[#121212] pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <main className="relative z-10 px-4 py-5 pb-44">

        <TradingTrack />

        <CardOne />
        <CardTwo />

        {/* 4. ATIS YO */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 px-1 text-white/90">Atis ou pi renmen</h2>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {/* Nou ka filtre atis inik ki nan trending yo pou kounye a */}
            {trendingTracks.slice(0, 5).map((track, i) => (
              <div key={i} className="min-w-[110px] flex flex-col items-center">
                <div
                  onClick={() => navigate(`/artist/${track.artist.username}`)}
                  className="w-24 h-24 rounded-full mb-2 overflow-hidden shadow-2xl border border-white/5 cursor-pointer active:scale-95 transition-transform"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${track.artist.username}`}
                    alt="Artist Avatar"
                    className="w-full h-full object-cover bg-[#282828]"
                  />
                </div>
                <span className="text-[12px] font-bold text-center text-white/80">{track.artist.username}</span>
              </div>
            ))}
          </div>
        </section>

        <CardTwo />
        <CardTwo />

        <div className="mt-12 px-1 text-[#b3b3b3] text-sm space-y-6 border-t border-white/5 pt-8">
          <h2 className="text-white font-bold text-lg italic">H-MIZIK <span className="text-orange-500 text-xs">BETA</span></h2>
          <p>
            H-MIZIK se premye platfòm 100% lokal ki itilize algoritm pwofesyonèl pou pwoteje kreyativite atis ayisyen yo.
          </p>

          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-6">
            <h2 className="text-orange-500 font-bold mb-1">H-Mizik sou telefòn ou</h2>
            <p className="text-zinc-400 text-sm mb-4">Enstale aplikasyon an pou w ka jwenn li pi fasil epi koute mizik offline.</p>
            <button
              onClick={installApp}
              className={`flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition ${!isInstallable ? 'opacity-50' : 'opacity-100'}`}
            >
              <DownloadCloud size={18} />
              Enstale Kounye a {!isInstallable && "(Poko Prè)"}
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Main;