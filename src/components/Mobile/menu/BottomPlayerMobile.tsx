import React, { useState } from 'react';
import { Play, Pause, MonitorSpeaker, Heart } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import PlayerPage from '../Songpage/SongPage';
import img  from "../../../assets/toby.webp"
const BottomMPlayerMobile: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const [currentSong] = useState({
    id: "1",
    title: "Mizik Fle", // Tit mizik la
    artist: "Atis Klasik", // Non atis la
    cover: img, // Imaj album lan
    album: "H-Mizik Hits",
    duration: "3:45",
    color: "#5d3fd3" // Ou ka mete yon koulè default si useImageColors poko chaje
  });
  return (
    <div className="fixed bottom-[80px] w-full z-50" onClick={() => setShowPlayer(true)}>
      <AnimatePresence>
        {showPlayer && (
          <PlayerPage
            song={currentSong}
            onClose={() => setShowPlayer(false)}
          />
        )}
      </AnimatePresence>
      {/* Container a ak Glassmorphism oswa koulè solid */}
      <div className="bg-black rounded-md p-2 flex items-center justify-between shadow-2xl border border-zinc-800/50">

        {/* 1. Enfòmasyon Chanson (Gòch) */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={img}
            alt="Album Art"
            className="h-11 w-11 rounded-md shadow-md"
          />
          <div className="flex flex-col min-w-0">
            <h4 className="text-[13px] font-bold text-white truncate">
              Tit Chanson an ki Long Anpil
            </h4>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-green-500 font-medium">Atis la</span>
              <span className="text-zinc-400 text-[10px]">•</span>
              <MonitorSpeaker className="w-3 h-3 text-green-500" />
            </div>
          </div>
        </div>

        {/* 2. Aksyon (Dwa) */}
        <div className="flex items-center gap-4 px-2">
          <Heart
            onClick={() => setIsLiked(!isLiked)}
            className={`w-6 h-6 transition-colors ${isLiked ? 'fill-green-500 text-green-500' : 'text-zinc-400'}`}
          />

          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white active:scale-90 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white" />
            )}
          </div>
        </div>

        {/* 3. Bar Pwogresyon (Anba nèt nan ti bwat la) */}
        <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-zinc-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: '35%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomMPlayerMobile;