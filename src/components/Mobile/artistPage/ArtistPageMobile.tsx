import  { useState, useEffect } from 'react';
import { MoreVertical, Play, ChevronLeft, Verified } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';
import artistImg from "../../../assets/banner.jpg"; // Foto atis la
import { useImageColors } from "../../utils/GetColor";

const ArtistPageMobile = () => {
    const { bgColor, imgRef } = useImageColors(artistImg);
    const [isScrolled, setIsScrolled] = useState(false);

    const popularSongs = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `Gwo Mizik #${i + 1}`,
        plays: "1,245,000",
        cover: `https://picsum.photos/seed/${i + 50}/100/100`
    }));

    const { scrollY } = useScroll();

    // Animasyon pou tit la ak banner la
    const headerOpacity = useTransform(scrollY, [0, 250], [1, 0]);
    const navOpacity = useTransform(scrollY, [200, 300], [0, 1]);
    const bannerScale = useTransform(scrollY, [-100, 0, 100], [1.2, 1, 1]);

    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', bgColor || '#121212');
        }

        const unsubscribe = scrollY.onChange((latest) => {
            setIsScrolled(latest > 280);
        });
        return () => {
            unsubscribe();
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#121212');
        };
    }, [bgColor, scrollY]);

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans relative">

            {/* 1. FIXED NAV */}
            <motion.nav
                style={{ backgroundColor: bgColor, opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center px-4 gap-4 pointer-events-none"
            >
                <ChevronLeft size={24} className="pointer-events-auto" />
                <h2 className="text-sm font-black">Atis H-Mizik</h2>
            </motion.nav>

            {/* 2. BANNER IMAGE */}
            <div className="absolute top-0 left-0 right-0 h-[45vh] overflow-hidden z-0">
                <motion.img
                    style={{ scale: bannerScale }}
                    src={artistImg}
                    ref={imgRef}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#121212]" />
            </div>

            <main className="relative z-10">
                {/* 3. ARTIST INFO (Non li an gwo) */}
                <motion.div
                    style={{ opacity: headerOpacity }}
                    className="h-[45vh] flex flex-col justify-end px-6 pb-6"
                >
                    <div className="flex items-center gap-1 mb-2">
                        <Verified size={16} className="text-blue-400 fill-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Atis Verifye</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter mb-4">Atis H-Mizik</h1>
                    <span className="text-sm font-bold text-white/80">3.5M moun koute pa mwa</span>
                </motion.div>

                {/* 4. ACTION BAR (Sticky) */}
                <div className={`sticky top-16 z-40 flex items-center justify-between px-6 py-4 transition-colors ${isScrolled ? 'bg-[#121212]' : 'bg-transparent'}`}>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 border border-white/30 rounded-full text-xs font-bold hover:bg-white/10 transition">
                            Follow
                        </div>
                        <MoreVertical size={24} className="text-zinc-400" />
                    </div>
                    <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition">
                        <Play size={28} className="fill-black text-black ml-1" />
                    </div>
                </div>

                {/* 5. POPULAR SONGS SECTION */}
                <div className="bg-[#121212] px-6 pt-4 pb-40">
                    <h3 className="text-lg font-black mb-4">Popilè</h3>
                    <div className="space-y-4">
                        {popularSongs.map((song, index) => (
                            <div key={song.id} className="flex items-center gap-4 group active:bg-white/5 p-1 rounded-md transition">
                                <span className="text-xs text-zinc-500 w-4">{index + 1}</span>
                                <img crossOrigin="anonymous" src={song.cover} className="w-12 h-12 rounded-sm" alt="" />
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="text-sm font-bold truncate">{song.title}</h4>
                                    <p className="text-xs text-zinc-500">{song.plays}</p>
                                </div>
                                <MoreVertical size={18} className="text-zinc-500" />
                            </div>
                        ))}
                    </div>

                    {/* 6. ABOUT SECTION (Ti profil won an) */}
                    <h3 className="text-lg font-black mt-10 mb-4">Konsènan</h3>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden group cursor-pointer">
                        <img
                            
                            src={artistImg}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                            <p className="text-sm font-bold line-clamp-3">
                                Atis sa a se youn nan pi gwo zetwal H-Mizik kounye a, ak plis pase 10 an eksperyans nan endistri a...
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <BottomMenu />
        </div>
    );
};

export default ArtistPageMobile;