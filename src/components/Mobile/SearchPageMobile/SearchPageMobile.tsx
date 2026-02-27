import React, { useState } from 'react';
import { Search as SearchIcon, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';

// Tipizasyon pou kategori yo
interface Category {
    id: string;
    title: string;
    color: string;
    img: string;
}

const categories: Category[] = [
    { id: '1', title: 'Rabòday', color: '#E8115B', img: 'https://picsum.photos/seed/rab/200' },
    { id: '2', title: 'Konpa', color: '#148A08', img: 'https://picsum.photos/seed/konpa/200' },
    { id: '3', title: 'Rap Kreyòl', color: '#503750', img: 'https://picsum.photos/seed/rap/200' },
    { id: '4', title: 'Levanjil', color: '#1E3264', img: 'https://picsum.photos/seed/gosp/200' },
    { id: '5', title: 'Afrobeat', color: '#8C1932', img: 'https://picsum.photos/seed/afro/200' },
    { id: '6', title: 'Slow/Love', color: '#77422E', img: 'https://picsum.photos/seed/love/200' },
    { id: '7', title: 'Live Konpa', color: '#AF2896', img: 'https://picsum.photos/seed/live/200' },
    { id: '8', title: 'New Releases', color: '#F59B23', img: 'https://picsum.photos/seed/new/200' },
];

const SearchPageMobile: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-[#121212] text-white px-4 pb-32 pt-6">
            
            {/* 1. HEADER TIT */}
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-black">Search</h1>
            </header>

            {/* 2. SEARCH BAR (Sticky) */}
            <div className="sticky top-4 z-50 mb-8">
                <div className="relative group">
                    <SearchIcon 
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-900 group-focus-within:text-orange-500 transition-colors" 
                        size={20} 
                    />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="What do you want to listen to?"
                        className="w-full bg-white py-3.5 pl-12 pr-12 rounded-lg text-black font-bold outline-none placeholder:text-zinc-500 text-sm"
                    />
                    <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                </div>
            </div>

            {/* 3. CATEGORIES GRID */}
            <h2 className="text-sm font-black uppercase tracking-widest mb-4 text-zinc-400">Browse all</h2>
            
            <div className="grid grid-cols-2 gap-4">
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.id}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ backgroundColor: cat.color }}
                        className="relative h-28 rounded-xl overflow-hidden cursor-pointer p-3 shadow-lg group"
                    >
                        {/* Tit Kategori a */}
                        <span className="text-lg font-black leading-tight tracking-tight break-words pr-8">
                            {cat.title}
                        </span>

                        {/* Imaj ki panche a (Spotify Style) */}
                        <img 
                            src={cat.img} 
                            alt={cat.title}
                            className="absolute -right-4 -bottom-2 w-16 h-16 object-cover rotate-[25deg] shadow-2xl transition-transform group-hover:scale-110"
                        />
                    </motion.div>
                ))}
            </div>
            <BottomMenu/>
        </div>
    );
};

export default SearchPageMobile;