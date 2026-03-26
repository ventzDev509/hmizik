import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Mic, X, Clock, ChevronRight, Verified, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../context/SearchContext';
import BottomMenu from '../menu/BottomMenu';
import { Disc, Music, Mic2, Radio, Heart, Flame } from 'lucide-react';

const getAvatarColor = (name: string) => {
    const colors = [
        'bg-orange-600', 'bg-blue-600', 'bg-purple-600',
        'bg-emerald-600', 'bg-pink-600', 'bg-indigo-600',
        'bg-red-600', 'bg-teal-600'
    ];
    const index = name.length % colors.length;
    return colors[index];
};

const categories = [
    { id: '1', title: 'Rabòday', color: '#E8115B', icon: Flame },
    { id: '2', title: 'Konpa', color: '#148A08', icon: Disc },
    { id: '3', title: 'Rap Kreyòl', color: '#503750', icon: Mic2 },
    { id: '4', title: 'Levanjil', color: '#1E3264', icon: Music },
    { id: '5', title: 'Afrobeat', color: '#8C1932', icon: Radio },
    { id: '6', title: 'Slow/Love', color: '#77422E', icon: Heart },
];

const SearchPageMobile: React.FC = () => {
    const navigate = useNavigate();
    const {
        query, setQuery, results, loading, searchGlobal,
        clearSearch, recentSearches, addRecentSearch, removeRecentSearch
    } = useSearch();

    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.trim()) {
                searchGlobal(query);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [query, searchGlobal]);

    const handleSelectResult = (type: string, id: string, name: string) => {
        addRecentSearch(name);
        navigate(`/${type}/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white px-4 pb-40 pt-6">

            <header className="mb-6">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Chèche</h1>
            </header>

            {/* 1. BAR RECHÈCH */}
            <div className="sticky top-4 z-50 mb-6">
                <div className="relative group">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-900" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Kisa w ta renmen tande?"
                        className="w-full bg-white py-4 pl-12 pr-12 rounded-xl text-black font-bold outline-none placeholder:text-zinc-500 text-sm shadow-2xl"
                    />
                    {query ? (
                        <X onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 active:scale-75" size={20} />
                    ) : (
                        <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    )}
                </div>

                {/* 2. FILTRE YO */}
                <AnimatePresence>
                    {query && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2"
                        >
                            {[
                                { id: 'all', label: 'Tout' },
                                { id: 'tracks', label: 'Mizik' },
                                { id: 'artists', label: 'Atis' },
                                { id: 'albums', label: 'Albòm' },
                                { id: 'playlists', label: 'Playlis' }
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === f.id ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/60'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. KONTNI DINAMIK */}
            {!query ? (
                <div className="space-y-8">
                    {recentSearches.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest mb-4 text-zinc-400">Dènye rechèch</h2>
                            <div className="space-y-4">
                                {recentSearches.map((term) => (
                                    <div key={term} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4 flex-1" onClick={() => setQuery(term)}>
                                            <Clock size={18} className="text-zinc-500" />
                                            <span className="font-bold text-zinc-300">{term}</span>
                                        </div>
                                        <X size={18} className="text-zinc-600" onClick={() => removeRecentSearch(term)} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest mb-4 text-zinc-400">Dekouvri tout</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map((cat) => (
                                <motion.div
                                    key={cat.id}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ backgroundColor: cat.color }}
                                    className="relative h-28 rounded-xl overflow-hidden p-4 shadow-lg cursor-pointer group"
                                >
                                    <span className="text-lg font-black leading-tight italic uppercase text-white/90">
                                        {cat.title}
                                    </span>
                                    <div className="absolute -right-2 -bottom-2 opacity-20 transition-transform group-hover:scale-110 group-hover:rotate-12">
                                        <cat.icon size={50} strokeWidth={1.5} className="text-white" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                <div className="space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center pt-20">
                            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                            <p className="mt-4 text-orange-500 font-black italic tracking-tighter animate-pulse uppercase text-center">N ap chèche sou H-Mizik...</p>
                        </div>
                    ) : (
                        <>
                            {/* ATIS */}
                            {(activeFilter === 'all' || activeFilter === 'artists') && results.artists.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Atis</h3>
                                    <div className="space-y-4">
                                        {results.artists.map(art => (
                                            <div key={art.id} onClick={() => handleSelectResult('atis', art.id, art.username)} className="flex items-center gap-4 active:bg-white/5 p-2 rounded-2xl transition">
                                                <img src={art.avatarUrl} className="w-14 h-14 rounded-full object-cover border border-white/10" alt="" />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-1">
                                                        <p className="font-bold">{art.username}</p>
                                                        {art.verified && <Verified size={14} className="text-blue-400 fill-blue-400" />}
                                                    </div>
                                                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Atis</p>
                                                </div>
                                                <ChevronRight size={18} className="text-white/20" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* MIZIK */}
                            {(activeFilter === 'all' || activeFilter === 'tracks') && results.tracks.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Mizik</h3>
                                    <div className="space-y-1">
                                        {results.tracks.map(track => (
                                            <div key={track.id} onClick={()=>navigate(`/song?id=${track?.id}`)} className="flex items-center gap-4 active:bg-white/5 p-2 rounded-xl transition">
                                                <img src={track.coverUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                                <div className="flex-1 truncate">
                                                    <p className="font-bold truncate text-sm">{track.title}</p>
                                                    <p className="text-xs text-zinc-500">{track.artist?.username}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* ALBÒM */}
                            {(activeFilter === 'all' || activeFilter === 'albums') && results.albums.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Albòm</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {results.albums.map(alb => (
                                            <div key={alb.id} onClick={() => handleSelectResult('album', alb.id, alb.title)} className="bg-white/5 p-3 rounded-2xl space-y-2">
                                                <img src={alb.coverUrl} className="w-full aspect-square object-cover rounded-xl shadow-lg" alt="" />
                                                <div className="truncate">
                                                    <p className="font-bold text-sm truncate">{alb.title}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase">{alb.artist?.username}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* PLAYLIS */}
                            {(activeFilter === 'all' || activeFilter === 'playlists') && results.playlists?.length > 0 && (
                                <section className="mt-8">
                                    <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Playlis</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {results.playlists.map(pl => (
                                            <div 
                                                key={pl.id} 
                                                onClick={() => handleSelectResult('playlist', pl.id, pl.name)} 
                                                className="bg-white/5 p-3 rounded-2xl space-y-2 active:scale-95 transition group"
                                            >
                                                <div className={`relative aspect-square overflow-hidden rounded-xl shadow-lg flex items-center justify-center transition-transform group-hover:scale-105 ${getAvatarColor(pl.name)}`}>
                                                    <span className="text-4xl font-black text-white/90 uppercase italic select-none">
                                                        {pl.name.charAt(0)}
                                                    </span>
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                         <Play size={30} className="fill-white text-white" />
                                                    </div>
                                                </div>
                                                <div className="truncate px-1 pt-1">
                                                    <p className="font-bold text-sm truncate uppercase tracking-tight">{pl.name}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                                                        Pa {pl.user?.name || "H-Mizik"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            )}

            <BottomMenu />
        </div>
    );
};

export default SearchPageMobile;