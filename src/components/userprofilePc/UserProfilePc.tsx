import  { useState } from 'react';
import { 
  Settings, Share2, ListMusic, 
  Play, Camera, Verified, MoreHorizontal, 
  Heart, Music
} from 'lucide-react';
import { motion } from 'framer-motion';
import userImg from "../../assets/OIP.webp";
import banner from "../../assets/banner.jpg";
import { useImageColors } from "../utils/GetColor";

const UserProfilePC = () => {
    const { bgColor } = useImageColors(userImg);
    const [activeTab, setActiveTab] = useState('uploads');

    const recentlyPlayed = [
        { id: 101, title: "Lavi a", artist: "Bèl Mizik", plays: "1.2M", cover: "https://picsum.photos/seed/12/300/300" },
        { id: 102, title: "Vibe", artist: "DJ Mix", plays: "850K", cover: "https://picsum.photos/seed/15/300/300" },
        { id: 103, title: "Kè m", artist: "Atis Lokal", plays: "500K", cover: "https://picsum.photos/seed/22/300/300" },
        { id: 104, title: "Plizyè", artist: "Konpa", plays: "2M", cover: "https://picsum.photos/seed/33/300/300" },
    ];

    return (
        <div className=" bg-[#0b0b0b] text-white font-sans">
            
            {/* 1. BIG HEADER BANNER */}
            <div className="relative h-[350px] w-full overflow-hidden">
                <motion.img 
                    src={banner} 
                    className="absolute inset-0 w-full h-[120%] object-cover opacity-20 blur-md"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                />
                <div 
                    className="absolute inset-0 z-10"
                    style={{ 
                        background: `linear-gradient(to bottom, ${bgColor}44 0%, #0b0b0b 100%)` 
                    }}
                />
                
                {/* 2. PROFILE HERO AREA (Desktop Layout) */}
                <div className="absolute bottom-0 left-0 right-0 z-20 px-12 pb-10 flex items-end gap-8">
                    <div className="relative group">
                        <div className="w-48 h-48 rounded-full border-[6px] border-[#0b0b0b] overflow-hidden shadow-2xl bg-zinc-800">
                            <img src={userImg} className="w-full h-full object-cover" alt="avatar" />
                        </div>
                        <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={32} />
                        </button>
                    </div>

                    <div className="flex-1 mb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-6xl font-black tracking-tighter">Mizik Ayisyen Fan</h1>
                            <Verified size={32} className="text-blue-400 fill-blue-400" />
                        </div>
                        <div className="flex items-center gap-6 mt-4">
                            <p className="text-lg font-bold text-zinc-400">@mizik_haiti_2024</p>
                            <div className="flex gap-4">
                                <span className="text-sm"><b className="text-white">1,240</b> Followers</span>
                                <span className="text-sm"><b className="text-white">450</b> Following</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition"><Share2 size={20}/></button>
                        <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition"><Settings size={20}/></button>
                        <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-full transition shadow-lg shadow-orange-500/20">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. MAIN CONTENT (Two Columns) */}
            <main className="px-12 py-10 grid grid-cols-12 gap-12">
                
                {/* LEFT COLUMN: Stats & Info */}
                <div className="col-span-4 space-y-8">
                    <section className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5">
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">About</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            Mwen se yon gwo fanatik mizik ayisyen, depi sou Konpa pou rive nan Rabòday. 
                            Mwen renmen pataje bèl vibe ak tout moun!
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-zinc-400">#Haiti</span>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-zinc-400">#KonpaDirect</span>
                        </div>
                    </section>

                    <section className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5">
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Playlists</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                                    <ListMusic size={20}/>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold group-hover:text-orange-500 transition">Vibe l'anmou</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase">12 tracks</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Recently Played & Tabs */}
                <div className="col-span-8">
                    <h3 className="text-xl font-black mb-6">Recently Played</h3>
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        {recentlyPlayed.map((item) => (
                            <motion.div 
                                key={item.id} 
                                whileHover={{ y: -5 }}
                                className="bg-zinc-900/30 p-4 rounded-2xl border border-white/5 hover:bg-zinc-800/50 transition cursor-pointer group"
                            >
                                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                                    <img src={item.cover} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black">
                                            <Play fill="black" size={24}/>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="font-bold truncate">{item.title}</h4>
                                <p className="text-xs text-zinc-500 font-medium">{item.artist}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* TABS */}
                    <div className="flex border-b border-zinc-800 mb-6">
                        {['uploads', 're-ups', 'favorites'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT LIST */}
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition group">
                                <Music className="text-zinc-600 group-hover:text-orange-500" size={20}/>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold">Mizik Upload #{i}</h4>
                                    <p className="text-xs text-zinc-500">Mizik Ayisyen Fan • 2024</p>
                                </div>
                                <div className="flex gap-6 text-zinc-500">
                                    <Heart size={18} className="hover:text-red-500 cursor-pointer transition"/>
                                    <MoreHorizontal size={18} className="cursor-pointer"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfilePC;