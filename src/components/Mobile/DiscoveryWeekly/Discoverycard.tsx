import { Play } from "lucide-react";
import { useAudio } from "../../../provider/PlayerContext";
import Equalizer from "../../buffer/Equalizer";

interface TrackProps {
  track: any;
  suggestions: any[]; 
}

export default function DiscoveryCard({ track, suggestions }: TrackProps) {
  const { currentSong, isPlaying, playSong } = useAudio();

  
  const isActive = currentSong?.id === track.id;
  
  
  const artistName = track.artist?.user?.name || track.artist?.username || "Atis Enkoni";

  const handlePlay = () => {
    
    playSong(track, suggestions);
  };

  return (
    <div 
      onClick={handlePlay}
      className={`group flex items-center gap-4 p-2 rounded-xl transition-all cursor-pointer border border-transparent 
        ${isActive ? 'bg-orange-500/10 border-orange-500/20' : 'hover:bg-white/5 hover:border-white/10'}`}
    >
      {}
      <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-zinc-900 border border-white/5">
        <img 
          src={track.coverUrl || "/default-cover.jpg"} 
          alt={track.title}
          className={`object-cover w-full h-full transition-transform duration-500 
            ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
        />
        
        {}
        <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center 
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          
          {isActive && isPlaying ? (
            <Equalizer /> 
          ) : (
            <Play fill="white" size={14} className="text-white" />
          )}
        </div>
      </div>

      {}
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-sm truncate transition-colors ${isActive ? 'text-orange-500' : 'text-white'}`}>
          {track.title}
        </h3>
        <p className="text-[11px] text-zinc-500 truncate">{artistName}</p>
      </div>

     
    </div>
  );
}