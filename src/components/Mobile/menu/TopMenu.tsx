
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopMenu: React.FC = () => {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 py-2 w-full z-[1] bg-[#121212]/30 backdrop-blur-2xl border-b border-white/5">

      {/* 1. LIY LOGO AK PROFIL */}
      <div className="flex justify-between items-center px-4 h-16">

        {/* Bò Gòch: Non App la */}
        <div className="flex flex-col">
          <h1 className="text-xl font-[900] tracking-tighter text-white leading-none">
            H-MIZIK
          </h1>
          <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase">
            Haiti Stream
          </span>
        </div>

        {/* Bò Dwat: Rechèch + Profil */}
        <div  className="flex items-center gap-4">
          <div onClick={() => navigate('/notifications')} className="relative p-2 text-zinc-400 hover:text-white transition cursor-pointer">
            <Bell
              
              size={22}
              strokeWidth={2.5}
            />

            {/* Ti pwen wouj (Notification Badge) */}
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-[#121212] rounded-full"></span>
          </div>


          {/* Foto Profil User la */}
          <div onClick={() => navigate("/profile")} className="w-9 h-9 rounded-full border-2 border-orange-500 p-[2px] cursor-pointer active:scale-90 transition">
            <div className="w-full h-full rounded-full bg-zinc-700 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>


    </header>
  );
};

export default TopMenu;