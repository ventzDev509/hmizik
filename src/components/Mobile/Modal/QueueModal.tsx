import { X, Trash2 } from 'lucide-react';
import { useAudio } from '../../../provider/PlayerContext';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import Equalizer from '../../buffer/Equalizer'; 

const QueueModal = ({  onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { queue, removeFromQueue, currentSong, isPlaying } = useAudio();

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center sm:justify-end">
      {/* Overlay Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ 
          type: "spring", 
          damping: 30, 
          stiffness: 300
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="relative w-full max-w-md bg-[#0D0D0D] h-[85vh] sm:h-[90vh] rounded-t-[40px] sm:rounded-l-[40px] sm:rounded-tr-none p-6 flex flex-col overflow-hidden border-t border-white/5 shadow-2xl"
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center mb-6 sm:hidden cursor-grab">
          <div className="w-12 h-1 bg-white/10 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
              H-MIZIK <span className="text-orange-500">Queue</span>
            </h2>
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Lis k ap vini yo</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all active:scale-75"
          >
            <X className="text-white" size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Current Song Section - BG Nwa/Gri fonse */}
          <div className="mb-10">
            <p className="text-white/40 text-[10px] mb-4 font-black uppercase tracking-[0.2em] italic">K ap jwe kounye a</p>
            {currentSong && (
              <motion.div 
                layoutId="current-playing"
                className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5"
              >
                <div className="relative flex-shrink-0">
                  <img src={currentSong.coverUrl} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  {/* Equalizer nan plas zoranj la */}
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                    {isPlaying ? <Equalizer /> : <div className="w-1 h-3 bg-white/50 rounded-full" />}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-white font-black truncate text-lg italic uppercase tracking-tight leading-tight">
                    {currentSong.title}
                  </h3>
                  <p className="text-zinc-500 text-[11px] font-bold italic uppercase tracking-tighter">
                    {typeof currentSong.artist === 'string' ? currentSong.artist : currentSong.artist?.username}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Next Up Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
               <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] italic">Mizik ki nan tann</p>
               <span className="text-[10px] text-white/20 font-mono">{queue.length} Tracks</span>
            </div>

            {queue.length === 0 ? (
              <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]">
                <p className="text-white/10 italic text-sm font-bold uppercase tracking-widest">Lis la vid...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {queue.map((song, index) => (
                    <motion.div
                      key={`${song.id}-${index}`}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="flex items-center justify-between group p-2 hover:bg-white/[0.02] rounded-xl transition-colors border border-transparent hover:border-white/5"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <span className="text-white/10 font-mono text-[10px] w-4 font-bold">{index + 1}</span>
                        <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" alt="" />
                        <div className="overflow-hidden">
                          <p className="text-white text-sm font-black truncate italic uppercase tracking-tight leading-tight">
                            {song.title}
                          </p>
                          <p className="text-white/40 text-[10px] font-bold uppercase truncate">
                            {typeof song.artist === 'string' ? song.artist : song.artist?.username}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromQueue(song.id)}
                        className="p-2 text-white/10 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        
        <div className="h-10 flex-shrink-0" />
      </motion.div>
    </div>
  );
};

export default QueueModal;