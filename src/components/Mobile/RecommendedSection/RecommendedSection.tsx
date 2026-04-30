import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TrackProps {
  track: {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    genre: string;
  };
}

export default function RecommendationCard({ track }: TrackProps) {
     const navigate = useNavigate();
  return (
    <div className="flex-none w-36 group snap-start">
      <div onClick={() => navigate(`/song?id=${track.id}`)} className="relative aspect-square mb-3 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg border border-white/5">
        <img 
          src={track.coverUrl || "/default-cover.jpg"} 
          alt={track.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-orange-500 p-2 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Play fill="white" size={20} />
          </div>
        </div>
      </div>
      <h3 className="font-bold text-sm truncate text-white">{track.title}</h3>
      <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
      <span className="text-[10px] mt-1 inline-block px-2 py-0.5 bg-white/5 rounded text-orange-400 font-bold uppercase tracking-widest">
        {track.genre}
      </span>
    </div>
  );
}