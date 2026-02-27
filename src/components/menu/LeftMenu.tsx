
import {
  FiHome,
  FiSearch,
  FiPlusSquare,
  FiHeart,
  FiChevronDown,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface SidebarProps {
  playlists?: string[];
  onSelect?: (playlist: string) => void;
  
}

export default function Sidebar({ playlists = [], onSelect = () => {} }: SidebarProps,) {
  const colors = useSelector((state: RootState) => state.theme.colors);

  const mainNav = [
    { label: "Accueil", icon: <FiHome size={18} /> },
    { label: "Recherche", icon: <FiSearch size={18} /> },
  ];

  const quickActions = [
    { label: "Créer une playlist", icon: <FiPlusSquare size={16} /> },
    { label: "Titres likés", icon: <FiHeart size={16} /> },
  ];

  const samplePlaylists = playlists.length
    ? playlists
    : [ "Workout",  "Préférées"];

  return (
    <aside
   
    className="w-[300px] h-[100vh]  rounded-xl bg-gradient-to-b from-[#121212] to-[#0f0f0f] hidden md:flex flex-col text-gray-200">
      <div className="px-3 py-6">
        {/* Logo / Titre */}
        <div className="flex items-center gap-2 mb-6">
          <h5 className={`text-xl font-semibold ${colors.text}`}>H-musique</h5>
        </div>

        {/* Navigation principale */}
        <nav className="space-y-2">
          {mainNav.map((item) => (
            <div
              key={item.label}
              className={`w-full ${item.label=="Accueil" && 'bg-green-500'} flex items-center gap-3 px-3 py-2 rounded hover:bg-white/6 transition-colors ${colors.text}`}
            >
              <span className="text-gray-300">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Actions rapides */}
        <div className="mt-6 border-t flex flex-col gap-2 border-white/6 pt-4">
          {quickActions.map((act) => (
            <div
              key={act.label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/6 transition-colors ${colors.text}`}
            >
              <span className="text-gray-300">{act.icon}</span>
              <span className="text-sm font-medium">{act.label}</span>
            </div>
          ))}
        </div>

        {/* Playlists */}
        <div className="mt-6 flex items-center justify-between text-xs font-medium">
          <span className={`${colors.primary}`}>Playlists</span>
          <div className="flex items-center gap-1 hover:text-white">
            <FiChevronDown />
          </div>
        </div>

        <ul className="mt-3 max-h-[45vh] overflow-y-auto pr-2 space-y-2 text-sm">
          {samplePlaylists.map((pl, idx) => (
            <li key={pl + idx}>
              <button
                className={`w-full text-left truncate block px-2 py-1 rounded hover:bg-white/4 transition-colors ${colors.text}`}
                title={pl}
                onClick={() => onSelect(pl)}
              >
                {pl}
              </button>
            </li>
          ))}
        </ul>
      </div>

     
    </aside>
  );
}
