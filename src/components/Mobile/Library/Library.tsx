import React, { useState } from 'react';
import {
    Plus,
    Search,
    ListFilter,
    Heart,

    ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';

// Tipizasyon pou atik nan libreri a
interface LibraryItem {
    id: string;
    title: string;
    subtitle: string;
    type: 'Playlist' | 'Artist' | 'Album';
    img: string;
    isPinned?: boolean;
}

const libraryData: LibraryItem[] = [
    { id: '1', title: 'Liked Songs', subtitle: 'Playlist • 124 songs', type: 'Playlist', img: 'https://images.unsplash.com/photo-1514525253361-bee0483307a0?w=200&h=200&fit=crop', isPinned: true },
    { id: '2', title: 'Rabòday Mix 2026', subtitle: 'Playlist • H-Mizik', type: 'Playlist', img: 'https://picsum.photos/seed/mix1/200' },
    { id: '3', title: 'Bèl Mizik', subtitle: 'Artist', type: 'Artist', img: 'https://picsum.photos/seed/artist1/200' },
    { id: '4', title: 'Konpa Live Direct', subtitle: 'Playlist • 45 songs', type: 'Playlist', img: 'https://picsum.photos/seed/live/200' },
    { id: '5', title: 'Tony Mix', subtitle: 'Artist', type: 'Artist', img: 'https://picsum.photos/seed/tm/200' },
    { id: '6', title: 'Lavi a Bèl', subtitle: 'Album • Atis Lokal', type: 'Album', img: 'https://picsum.photos/seed/alb/200' },
];

const LibraryPage: React.FC = () => {
    const [filter, setFilter] = useState<string>('All');
    const filters = ['All', 'Playlists', 'Artists', 'Albums', 'Downloaded'];

    return (
        <div className="min-h-screen bg-[#121212] text-white pb-32">

            {/* 1. STICKY HEADER */}
            <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md px-4 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-black text-xs">
                            M
                        </div>
                        <h2 className="text-2xl font-black">Your Library</h2>
                    </div>
                    <div className="flex items-center gap-5">
                        <Search size={22} className="text-zinc-400" />
                        <Plus size={26} className="text-zinc-400" />
                    </div>
                </div>

                {/* 2. FILTER CHIPS */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {filters.map((f) => (
                        <div
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === f
                                    ? 'bg-orange-500 text-black'
                                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                }`}
                        >
                            {f}
                        </div>
                    ))}
                </div>
            </header>

            {/* 3. SORT & VIEW OPTIONS */}
            <div className="px-4 py-2 flex items-center justify-between text-zinc-400 mb-2">
                <div className="flex items-center gap-2 active:scale-95 transition">
                    <ArrowUpDown size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Recents</span>
                </div>
                <ListFilter size={18} />
            </div>

            {/* 4. LIBRARY LIST */}
            <div className="px-4 space-y-1">
                {libraryData.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        className="flex items-center gap-4 p-2 rounded-lg cursor-pointer group"
                    >
                        {/* Image Container */}
                        <div className={`relative w-16 h-16 flex-shrink-0 overflow-hidden ${item.type === 'Artist' ? 'rounded-full' : 'rounded-md shadow-lg'}`}>
                            {item.id === '1' ? (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-700 via-purple-600 to-blue-400 flex items-center justify-center">
                                    <Heart size={24} fill="white" className="text-white" />
                                </div>
                            ) : (
                                <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-bold truncate ${item.id === '1' ? 'text-orange-500' : 'text-white'}`}>
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-1.5">
                                {item.isPinned && <span className="text-orange-500 text-[10px]">📌</span>}
                                <p className="text-xs text-zinc-500 truncate">{item.subtitle}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 5. ADD MORE div (Sijesyon) */}
            <div className="mt-8 px-10">
                <div className="w-full py-3 border border-zinc-800 rounded-full text-xs font-black uppercase tracking-widest text-zinc-400 hover:border-zinc-500 transition">
                    Find more to add
                </div>
            </div>
            <BottomMenu/>
        </div>
    );
};

export default LibraryPage;