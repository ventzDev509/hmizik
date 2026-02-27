import  { useState, useEffect } from 'react';
import { MoreVertical, Play, Heart, Download, ChevronLeft } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';
import img from "../../../assets/OIF.webp";
import { useImageColors } from "../../utils/GetColor";

const PlaylistPage = () => {
    const { bgColor, imgRef } = useImageColors(img);
    const [isScrolled, setIsScrolled] = useState(false);

    // Done tès
    const songs = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Mizik Ayisyen #${i + 1}`,
        artist: "Atis H-Mizik",
        cover: `https://picsum.photos/seed/${i + 10}/100/100`
    }));

    // Lojik pou detekte scroll
    const { scrollY } = useScroll();
    
    // Animasyon pou imaj la vin piti epi disparèt nan nav la
    const imgOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const imgScale = useTransform(scrollY, [0, 200], [1, 0.8]);
    const navOpacity = useTransform(scrollY, [150, 250], [0, 1]);

    useEffect(() => {
        // Chanje Meta Theme Color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', bgColor || '#121212');
        }

        const unsubscribe = scrollY.onChange((latest) => {
            setIsScrolled(latest > 200);
        });
        return () => {
            unsubscribe();
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#121212');
        };
    }, [bgColor, scrollY]);

    return (
        <div className="bg-[#121212] text-white font-sans relative overflow-x-hidden">
            
            {/* 1. FIXED TOP NAV (K ap parèt lè w scroll) */}
            <motion.nav 
                style={{ backgroundColor: bgColor, opacity: navOpacity }}
                className="fixed  top-0 left-0 right-0 h-16 z-[100] flex items-center px-4 gap-4 pointer-events-none"
            >
                <ChevronLeft size={24} className="pointer-events-auto" />
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src={img} className="w-8 h-8 rounded-sm object-cover" alt="mini" />
                    <h2 className="text-sm font-black truncate">H-MIZIK Top 50</h2>
                </div>
            </motion.nav>

            {/* 2. HEADER DYNAMIQUE (Gradient) */}
            <div
                className="absolute top-0 left-0 right-0 h-[50vh] z-0"
                style={{
                    background: `linear-gradient(to bottom, ${bgColor || '#333'} 0%, #121212 100%)`
                }}
            />

            <main className="relative z-10 pt-12">
                {/* 3. INFO PLAYLIST (Imaj + Tit k ap disparèt nan scroll) */}
                <motion.div 
                    style={{ opacity: imgOpacity, scale: imgScale }}
                    className="flex flex-col items-center px-6 pb-6 pt-6"
                >
                    <div className="w-52 h-52 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                        <img
                            ref={imgRef}
                            src={img}
                            alt="Playlist Cover"
                            className="w-full h-full object-cover rounded-sm"
                        />
                    </div>
                    <div className="w-full">
                        <h1 className="text-2xl font-black mb-2 tracking-tight">H-MIZIK Top 50</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold">H</div>
                            <span className="text-xs font-bold text-white/80">H-Mizik • 12,450 likes</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4. ACTION BAR */}
                <div className={`sticky top-16 z-40 flex justify-between items-center px-6 py-4 transition-colors duration-300 ${isScrolled ? 'bg-[#121212]' : 'bg-transparent'}`}>
                    <div className="flex items-center gap-6 text-zinc-400">
                        <Heart size={26} className="hover:text-orange-500 transition" />
                        <Download size={24} />
                        <MoreVertical size={24} />
                    </div>
                    <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition">
                        <Play size={28} className="fill-black text-black ml-1" />
                    </div>
                </div>

                {/* 5. LISTE DES MUSIQUES */}
                <div className="px-4 space-y-1 pb-40 bg-[#121212]">
                    {songs.map((song, index) => (
                        <div
                            key={song.id}
                            className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-md active:bg-white/10 transition group"
                        >
                            <span className="text-xs text-zinc-500 w-4 font-bold">{index + 1}</span>
                            <img src={song.cover} className="w-12 h-12 rounded object-cover shadow-md" alt={song.title} />
                            <div className="flex-1 overflow-hidden">
                                <h4 className="text-sm font-bold truncate">{song.title}</h4>
                                <p className="text-[11px] text-zinc-400 font-bold truncate uppercase tracking-tighter">{song.artist}</p>
                            </div>
                            <MoreVertical size={18} className="text-zinc-500" />
                        </div>
                    ))}
                </div>
            </main>

            <BottomMenu />
        </div>
    );
};

export default PlaylistPage;