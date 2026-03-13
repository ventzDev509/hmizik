import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../context/ProfileContext'; // Asire w chemen sa a kòrèk

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  
  // Nou rale 'profile' ak 'loading' nan context la
  const { profile, loading } = useProfile();

  // Nou kalkile inisyal la: Priyorite sou 'name' ki nan 'user' objè a
  const displayName = profile?.user?.name || profile?.username || "";
  const firstLetter = displayName ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <header className="sticky top-0 py-2 w-full z-[100] bg-[#121212]/30 backdrop-blur-2xl border-b border-white/5">
      <div className="flex justify-between items-center px-4 h-16">

        {/* Logo Section */}
        <div className="flex flex-col cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="text-xl font-[900] tracking-tighter text-white leading-none">
            H-MIZIK
          </h1>
          <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase">
            Haiti Stream
          </span>
        </div>

        {/* Aksyon Section */}
        <div className="flex items-center gap-4">
          
          {/* Notifikasyon */}
          <div 
            onClick={() => navigate('/notifications')} 
            className="relative p-2 text-zinc-400 hover:text-white transition cursor-pointer active:scale-90"
          >
            <Bell size={22} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-[#121212] rounded-full"></span>
          </div>

          {/* Profil Foto oswa Inisyal */}
          <div 
            onClick={() => navigate("/profile")} 
            className="w-10 h-10 rounded-full border-2 border-orange-500 p-[0.5px] cursor-pointer active:scale-90 transition flex items-center justify-center overflow-hidden bg-zinc-900 shadow-lg shadow-orange-500/10"
          >
            {loading ? (
              // Yon ti loader pandan context la ap fetchProfile
              <div className="w-full h-full bg-zinc-800 animate-pulse" />
            ) : profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                   // Si lyen Supabase la gen pwoblèm, nou kache img pou montre span an
                   (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-sm font-black text-orange-500 italic">
                {firstLetter}
              </span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default TopMenu;