
import CardOne from "../CardsMobile/CardOne";
import TradingTrack from "../CardsMobile/TradSong";
import { DownloadCloud, Loader2 } from "lucide-react";
import { usePWA } from "../hooks/usePWA";
import { useAlbum } from "../../../context/AlbumContext";
import { useEffect, useState } from "react";
import AlbumCard from "../album/AlbumCard";
import ArtistSection from "../Artise/ArtisteSection";
import axios from "axios";
import RecommendationCard from "../RecommendedSection/RecommendedSection";

function Main() {
  const { isInstallable, installApp } = usePWA();
  const { albums, getAlbums, loading } = useAlbum();
  const [recommended, setRecommended] = useState([]);
  const [_, setRecLoading] = useState(false);

  useEffect(() => {
    getAlbums();
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setRecLoading(true);
      // Nou ka pran ID yon mizik itilizatè a te koute dènyèman
      const lastTrackId = localStorage.getItem("lastTrackId") || "some-default-id";
      const res = await axios.get(`https://hmizikbackend-1.onrender.com/recommendation/suggest/${lastTrackId}`);
      setRecommended(res.data);
      console.log(res)
    } catch (err) {
      console.error("Pa kapab jwenn rekòmandasyon", err);
    } finally {
      setRecLoading(false);
    }
  };
  useEffect(() => {
    getAlbums();

  }, []);


  if (loading) return <Loader2 className="animate-spin text-orange-600 mx-auto mt-10" />;
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

        <ArtistSection />

        <section className="px-2 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
              Album <span className="text-orange-500">Popilè</span>
            </h2>
            <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
              Wè tout
            </button>
          </div>

          {/* GRID LA */}
          <div className="flex overflow-x-auto gap-4  pb-6 scrollbar-hide snap-x">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>

          <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x">
              {recommended.map((track:any) => (
                <RecommendationCard key={track.id} track={track} />
              ))}
            </div>
        </section>

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