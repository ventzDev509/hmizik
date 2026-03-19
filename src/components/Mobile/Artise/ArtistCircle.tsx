import { useNavigate } from "react-router-dom";

interface Artist {
    username: string;
    avatar_url?: string; // Si w gen yon kolon pou foto
}

interface ArtistCircleProps {
    artist: Artist;
}

const ArtistCircle = ({ artist }: ArtistCircleProps) => {
    const navigate = useNavigate();

    // Si pa gen foto reyèl, nou itilize Dicebear kòm fallback
    const avatarSrc = artist.avatar_url 
        ? artist.avatar_url 
        : `https://api.dicebear.com/7.x/micah/svg?seed=${artist.username}`;

    return (
        <div className="min-w-[110px] flex flex-col items-center group">
            <div
                onClick={() => navigate(`/artist/${artist.username}`)}
                className="relative w-24 h-24 rounded-full mb-2 overflow-hidden shadow-2xl border-2 border-transparent group-hover:border-orange-500/50 cursor-pointer active:scale-95 transition-all duration-300"
            >
                <img
                    crossOrigin="anonymous"
                    src={avatarSrc}
                    alt={artist.username}
                    className="w-full h-full object-cover bg-zinc-900 group-hover:scale-110 transition-transform duration-500"
                />
                {/* Yon ti overlay pou fè l parèt pi fon lè w klike */}
                <div className="absolute inset-0 bg-black/10 group-active:bg-black/30 transition-colors" />
            </div>
            
            <span className="text-[12px] font-black text-center text-white/70 group-hover:text-white transition-colors truncate w-full px-2">
                @{artist.username}
            </span>
        </div>
    );
};

export default ArtistCircle;