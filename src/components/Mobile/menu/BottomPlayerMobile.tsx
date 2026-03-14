import React, { useState, useMemo } from 'react';
import { Play, Pause, MonitorSpeaker, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import PlayerPage from '../Player/Player';
import { useAudio } from '../../../provider/PlayerContext';

const BottomMPlayerMobile: React.FC = () => {
  const [showPlayer, setShowPlayer] = useState(false);
  
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    isBuffering, 
    currentTime, 
    duration 
  } = useAudio();

  const progressPercent = useMemo(() => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  return (
    <>
      {/* 1. ANIMASYON POU PARÈT/DISPARÈT MINI PLAYER A */}
      <AnimatePresence>
        {currentSong && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} // Kòmanse anba epi envizib
            animate={{ y: 0, opacity: 1 }}   // Moute epi parèt
            exit={{ y: 100, opacity: 0 }}    // Desann epi disparèt si currentSong vin null
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-[80px] left-2 right-2 z-50" 
            onClick={() => setShowPlayer(true)}
          >
            <div className="bg-zinc-900/95 backdrop-blur-lg rounded-xl p-2 flex items-center justify-between shadow-2xl border border-white/10 relative overflow-hidden">
              
              {/* Enfòmasyon Chanson */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                crossOrigin="anonymous"
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className={`h-11 w-11 rounded-lg shadow-md object-cover ${isPlaying ? 'animate-pulse-slow' : ''}`}
                />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-[13px] font-bold text-white truncate italic uppercase tracking-tighter">
                    {currentSong.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-orange-500 font-bold truncate uppercase tracking-tighter">
                       {typeof currentSong.artist === 'string' ? currentSong.artist : currentSong.artist?.username}
                    </span>
                    <MonitorSpeaker className="w-3 h-3 text-orange-500 ml-1" />
                  </div>
                </div>
              </div>

              {/* Kontwòl */}
              <div className="flex items-center gap-4 px-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="text-white active:scale-90 transition-transform w-8 h-8 flex items-center justify-center"
                >
                  {isBuffering ? (
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  ) : isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-1" />
                  )}
                </div>
              </div>

              {/* Bar Pwogresyon */}
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10">
                <motion.div
                  className="h-full bg-orange-500"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ type: "tween", ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. GWO PLAYER A (FULL SCREEN) */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <PlayerPage onClose={() => setShowPlayer(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomMPlayerMobile;