import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import PushStateBtn from "./Chevron";

type NavbarProps = {
  bgColor?: string; // couleur à utiliser quand on scroll
};

export default function Navbar({ bgColor  }: NavbarProps) {
  const colors = useSelector((state: RootState) => state.theme.colors);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
  className=" top-0 left-0 right-0 w-full flex items-center justify-between px-6 py-3 shadow-sm transition-all duration-500 z-50 overflow-hidden"
  style={{
    borderTopLeftRadius: "13px",
    borderTopRightRadius: "13px",
    backgroundColor: bgColor,
    backdropFilter: isScrolled ? "blur(10px)" : "none",
    transition: "background 0.5s ease",
  }}
>

      
      <div className="flex items-center gap-3">
        <PushStateBtn />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Recherche"
            className={`pl-8 w-80 pr-3 py-2 rounded ${colors.grayOpacity} text-white placeholder-gray-400 focus:outline-none focus:ring-1 border border-[#6a6a6a21] focus:ring-green-500`}
          />
        </div>

        {/* Profil utilisateur */}
        <div
          className={`flex items-center gap-2 bg-white px-3 py-1 rounded text-black cursor-pointer transition`}
        >
          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-sm text-white">
            E
          </div>
          <span className="text-sm font-medium">Eventz</span>
          <FiChevronDown />
        </div>
      </div>
    </nav>
  );
}
