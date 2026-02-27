import { useState, useEffect } from 'react';
import {
    ChevronLeft, Settings,
    Share2, Grid, ListMusic,
    Play
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';
import userImg from "../../../assets/baky.webp";
import banner from "../../../assets/banner.jpg";
import { useImageColors } from "../../utils/GetColor";
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { bgColor, imgRef } = useImageColors(userImg);
    const [activeTab, setActiveTab] = useState('uploads');
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate=useNavigate()
    // Done tès pou "Recently Played"
    const recentlyPlayed = [
        { id: 101, title: "Lavi a", artist: "Bèl Mizik", cover: "https://picsum.photos/seed/12/200/200" },
        { id: 102, title: "Vibe", artist: "DJ Mix", cover: "https://picsum.photos/seed/15/200/200" },
        { id: 103, title: "Kè m", artist: "Atis Lokal", cover: "https://picsum.photos/seed/22/200/200" },
        { id: 104, title: "Plizyè", artist: "Konpa", cover: "https://picsum.photos/seed/33/200/200" },
        { id: 105, title: "Zetwal", artist: "Atis X", cover: "https://picsum.photos/seed/44/200/200" },
    ];

    const { scrollY } = useScroll();

    // Animasyon pou Header a lè w ap scroll
    const navOpacity = useTransform(scrollY, [80, 150], [0, 1]);
    const headerScale = useTransform(scrollY, [0, 100], [1, 0.95]);

    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', bgColor);
        }

        const unsubscribe = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 120);
        });

        return () => {
            unsubscribe();
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#121212');
        };
    }, [bgColor, isScrolled, scrollY]);

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans relative overflow-x-hidden">

            {/* 1. TOP NAVIGATION (K ap parèt nan scroll) */}
            <motion.nav
                style={{ backgroundColor: bgColor || '#1e1e1e', opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-4 border-b border-white/5"
            >
                <div className="flex items-center gap-4">
                    <ChevronLeft size={24} className="cursor-pointer" />
                    <h2 className="text-sm font-black truncate max-w-[150px]">Mizik Ayisyen Fan</h2>
                </div>
                <div className="flex items-center gap-4">
                    <Share2 size={20} />
                    <Settings onClick={()=>navigate("/settings")} size={20} />
                </div>
            </motion.nav>

            {/* 2. DYNAMIC BACKGROUND HEADER */}
            {/* 2. DYNAMIC BACKGROUND HEADER (RANPLI) */}
            <div className="relative h-64 w-full overflow-hidden">
                {/* Imaj Banner la (Ou ka itilize menm userImg la oswa yon lòt imaj) */}
                <motion.img
                    src={banner}
                    ref={imgRef}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px]"
                    style={{ scale: 1.2 }} // Yon ti zoom pou l ranpli bor yo
                    alt="banner"
                />

                {/* Gradyan an k ap vin sou imaj la pou fè l fonn */}
                <div
                    className="absolute inset-0 z-10 transition-colors duration-1000 ease-in-out"
                    style={{
                        background: `linear-gradient(to bottom, 
                ${bgColor}66 0%, 
                ${bgColor}AA 40%, 
                #121212 100%)`
                    }}
                />

                {/* Yon kouch "Mesh" oswa "Noise" (Opsyonèl pou stil Audiomack) */}
                {/* <div className="absolute inset-0 z-[11] opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" /> */}

                {/* Bouton Share ak Settings */}
                {!isScrolled && (
                    <div className="absolute top-6 right-6 z-20 flex gap-5">
                        <div className="bg-black/20 p-2 rounded-full backdrop-blur-md">
                            <Share2 size={20} className="text-white active:scale-90 transition" />
                        </div>
                        <div className="bg-black/20 p-2 rounded-full backdrop-blur-md">
                            <Settings size={20} className="text-white active:scale-90 transition" />
                        </div>
                    </div>
                )}
            </div>

            <main className="relative z-10 -mt-16 px-6">
                {/* 3. USER PROFILE INFO */}
                <motion.div style={{ scale: headerScale }} className="flex flex-col">
                    <div className="w-28 h-28 rounded-full border-[5px] border-[#121212] overflow-hidden shadow-2xl mb-4 bg-zinc-800">
                        <img

                            src={userImg}
                            className="w-full h-full object-cover"
                            alt="avatar"
                        />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter">Mizik Ayisyen Fan</h1>
                    <p className="text-sm text-zinc-500 font-bold mb-5">@mizik_haiti_2024</p>

                    {/* STATS AREA */}
                    <div className="flex gap-8 mb-6">
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight">1.2K</span>
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Followers</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight">450</span>
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Following</span>
                        </div>
                    </div>

                    <div onClick={()=>navigate("/editeProfile")} className="w-full py-3 text-center bg-zinc-800/80 hover:bg-zinc-700 rounded-lg text-sm font-black active:scale-[0.97] transition-all">
                        Edit Profile
                    </div>
                </motion.div>
               
                {/* 4. RECENTLY PLAYED (Horizontal Scroll) */}
                <div className="mt-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Recently Played</h3>
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter cursor-pointer">See All</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                        {recentlyPlayed.map((item) => (
                            <motion.div
                                key={item.id}
                                whileTap={{ scale: 0.94 }}
                                className="flex-shrink-0 w-32"
                            >
                                <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg mb-2 relative group">
                                    <img
                                        src={item.cover}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={24} className="fill-white text-white" />
                                    </div>
                                </div>
                                <h4 className="text-[12px] font-bold truncate text-white/90">{item.title}</h4>
                                <p className="text-[10px] text-zinc-500 font-bold truncate">{item.artist}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 5. TABS NAVIGATION (Sticky) */}
                <div className={`sticky top-14 z-50 bg-[#121212] mt-6 flex border-b border-zinc-800/50 transition-all ${isScrolled ? 'pt-2' : ''}`}>
                    {['uploads', 'playlists', 're-ups'].map((tab) => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                                ? 'text-orange-500 border-b-2 border-orange-500'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* 6. TAB CONTENT AREA */}
                <div className="py-8 pb-40 min-h-[40vh]">
                    {activeTab === 'uploads' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-16 text-zinc-600"
                        >
                            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                <Grid size={32} />
                            </div>
                            <p className="text-sm font-bold tracking-tight">No uploads yet</p>
                            <p className="text-xs font-medium opacity-60">Your shared tracks will appear here.</p>
                        </motion.div>
                    )}

                    {activeTab === 'playlists' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-2 gap-5"
                        >
                            <div className="group cursor-pointer">
                                <div className="aspect-square bg-zinc-900 rounded-xl mb-3 overflow-hidden flex items-center justify-center border border-white/5 group-active:scale-95 transition-transform">
                                    <ListMusic size={40} className="text-zinc-800" />
                                </div>
                                <h4 className="text-xs font-black truncate">My Favorites</h4>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">24 tracks</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            <BottomMenu />
        </div>
    );
};

export default UserProfile;