import { useNavigate } from "react-router-dom";

// Nou itilize menm interface ki nan Context la pou evite konfizyon
interface ArtistProps {
    artist: {
        id:string;
        username: string;
        avatarUrl?: string | null; 
        isArtist?: boolean;
        verified?: boolean;
        userId:string;
    };
}

const ArtistCircle = ({ artist }: ArtistProps) => {
    const navigate = useNavigate();

    // Fallback si avatarUrl la null oswa vid
    const avatarSrc = artist.avatarUrl 
        ? artist.avatarUrl 
        : `https://api.dicebear.com/7.x/micah/svg?seed=${artist.username}`;

    return (
        <div className="min-w-[110px] flex flex-col items-center group">
            <div
                onClick={() => navigate(`/atis/${artist?.userId}`)}
                className="relative w-24 h-24 rounded-full mb-2 overflow-hidden shadow-2xl border-2 border-transparent group-hover:border-orange-500 cursor-pointer active:scale-95 transition-all duration-300 bg-zinc-900"
            >
                <img
                    crossOrigin="anonymous"
                    src={avatarSrc}
                    alt={artist.username}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
                
                {/* Overlay pou entèraksyon */}
                <div className="absolute inset-0 bg-black/10 group-active:bg-orange-500/10 transition-colors" />
            </div>
            
            <div className="flex flex-col items-center w-full px-2">
                <span className="text-[11px] font-black text-center text-white/70 group-hover:text-white transition-colors truncate w-full italic uppercase tracking-tighter">
                    {artist.username}
                </span>
                
                {/* Ti endikatè si li verifye */}
                {artist.verified && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                )}
            </div>
        </div>
    );
};

export default ArtistCircle;