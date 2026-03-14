import React, { useState, useMemo } from 'react';
import { Plus, Search, ListFilter, Heart, ArrowUpDown, Loader2, Trash2, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLikes } from '../../../context/LikeContext';
import { usePlaylists } from '../../../context/PlaylistContext';
import BottomMenu from '../menu/BottomMenu';
import toast from 'react-hot-toast';

interface LibraryItem {
    id: string;
    title: string;
    subtitle: string;
    type: 'Playlist' | 'Atis' | 'Albòm';
    img?: string | null;
    isPinned?: boolean;
    path?: string;
}

const LibraryPage: React.FC = () => {
    const navigate = useNavigate();
    const { likedTrackIds } = useLikes();
    const { playlists, createPlaylist, deletePlaylist, updatePlaylist, loading: playlistLoading } = usePlaylists();

    const [filter, setFilter] = useState<string>('Tout');

    // States pou KREYASYON
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [isCreatingLoading, setIsCreatingLoading] = useState(false);

    // States pou MODAL AKSYON (Edit/Delete)
    const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const filters = ['Tout', 'Playlist', 'Atis', 'Albòm'];

    const getRandomColor = (id: string) => {
        const colors = ['bg-blue-600', 'bg-purple-600', 'bg-pink-600', 'bg-emerald-600', 'bg-rose-600', 'bg-indigo-600', 'bg-amber-600'];
        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };

    const libraryData = useMemo(() => {
        const fixedItems: LibraryItem[] = [{
            id: 'liked-songs',
            title: 'Mizik mwen renmen',
            subtitle: `Playlist • ${likedTrackIds.length} mizik`,
            type: 'Playlist',
            isPinned: true,
            path: '/sawrenmen'
        }];

        const userPlaylists: LibraryItem[] = playlists.map(p => ({
            id: p.id,
            title: p.name,
            subtitle: `Playlist • ${p._count?.tracks || 0} mizik`,
            type: 'Playlist',
            img: undefined,
            path: `/playlist/${p.id}`
        }));

        const allItems = [...fixedItems, ...userPlaylists];
        return filter === 'Tout' ? allItems : allItems.filter(item => item.type === filter);
    }, [likedTrackIds, playlists, filter]);

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        setIsCreatingLoading(true);
        try {
            await createPlaylist({ name: newPlaylistName });
            setNewPlaylistName('');
            setIsCreating(false);
            toast.success("Playlist kreye!");
        } catch (error) {
            toast.error("Echèk kreyasyon");
        } finally {
            setIsCreatingLoading(false);
        }
    };

    const handleActionOpen = (item: LibraryItem) => {
        if (item.id === 'liked-songs') return;
        setSelectedItem(item);
        setEditName(item.title);
        setIsEditing(false);
    };

    const handleUpdate = async () => {
        if (!editName.trim() || !selectedItem) return;
        setIsUpdating(true);
        const success = await updatePlaylist(selectedItem.id, editName);
        setIsUpdating(false);
        if (success) {
            toast.success("Non an chanje!");
            setSelectedItem(null);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        setIsDeleting(true);
        const success = await deletePlaylist(selectedItem.id);
        setIsDeleting(false);
        if (success) {
            toast.success("Playlist efase");
            setSelectedItem(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white pb-32">
            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md px-4 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-black text-xs">V</div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase">Libreri w</h2>
                    </div>
                    <div className="flex items-center gap-5">
                        <Search size={22} className="text-zinc-400" />
                        <Plus size={26} className="text-orange-500 cursor-pointer" onClick={() => setIsCreating(true)} />
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {filters.map((f) => (
                        <div key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${filter === f ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-white'}`}>{f}</div>
                    ))}
                </div>
            </header>

            <div className="px-4 py-2 flex items-center justify-between text-zinc-400 mb-2">
                <div className="flex items-center gap-2 cursor-pointer">
                    <ArrowUpDown size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Dènye yo</span>
                </div>
                <ListFilter size={18} />
            </div>

            {/* LIST ITEMS */}
            <div className="px-4 space-y-1">
                {playlistLoading && playlists.length === 0 ? (
                    <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>
                ) : (
                    libraryData.map((item) => {
                        let touchTimeout: any;
                        let startY = 0;

                        const handleTouchStart = (e: React.PointerEvent) => {
                            startY = e.clientY;
                            touchTimeout = setTimeout(() => {
                                handleActionOpen(item);
                            }, 600);
                        };

                        const handleTouchMove = (e: React.PointerEvent) => {
                            const moveY = Math.abs(e.clientY - startY);
                            if (moveY > 10) {
                                clearTimeout(touchTimeout);
                            }
                        };

                        const handleTouchEnd = () => {
                            clearTimeout(touchTimeout);
                        };

                        return (
                            <motion.div
                                key={item.id}
                                whileTap={{ scale: 0.96 }}
                                onContextMenu={(e) => { e.preventDefault(); handleActionOpen(item); }}
                                onPointerDown={handleTouchStart}
                                onPointerMove={handleTouchMove}
                                onPointerUp={handleTouchEnd}
                                onPointerLeave={handleTouchEnd}
                                onClick={() => item.path && navigate(item.path)}
                                className="flex items-center gap-4 p-2 rounded-xl cursor-pointer"
                            >
                                <div className={`relative w-16 h-16 flex-shrink-0 overflow-hidden shadow-lg ${item.type === 'Atis' ? 'rounded-full' : 'rounded-lg'}`}>
                                    {item.id === 'liked-songs' ? (
                                        <div className="w-full h-full bg-gradient-to-br from-orange-600 to-yellow-500 flex items-center justify-center">
                                            <Heart size={26} fill="white" />
                                        </div>
                                    ) : item.img ? (
                                        <img crossOrigin="anonymous" src={item.img} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center text-2xl font-black text-white/90 ${getRandomColor(item.id)}`}>
                                            {item.title.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-bold truncate ${item.id === 'liked-songs' ? 'text-orange-500' : 'text-white'}`}>{item.title}</h3>
                                    <p className="text-xs text-zinc-500 truncate uppercase font-medium">{item.subtitle}</p>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* MODAL KREYASYON */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isCreatingLoading && setIsCreating(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#1a1a1a] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/5 relative z-10">
                            <h3 className="text-center text-xl font-black uppercase italic mb-6">Nouvo Playlist</h3>
                            <input
                                disabled={isCreatingLoading}
                                autoFocus
                                type="text"
                                placeholder="Bay playlist la yon non..."
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none mb-6 focus:border-orange-500 transition-colors disabled:opacity-50"
                            />
                            <div className="flex gap-3">
                                <button disabled={isCreatingLoading} onClick={() => setIsCreating(false)} className="flex-1 py-4 font-bold text-zinc-500 disabled:opacity-50">Anile</button>
                                <button
                                    disabled={isCreatingLoading || !newPlaylistName.trim()}
                                    onClick={handleCreatePlaylist}
                                    className="flex-1 py-4 bg-orange-500 btn-primary   rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                                >
                                    {isCreatingLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    Kreye
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL AKSYON (Edit/Delete) */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isDeleting && !isUpdating && setSelectedItem(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-[#1a1a1a] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/5 relative z-10">
                            {!isEditing ? (
                                <div className="space-y-4">
                                    <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black ${getRandomColor(selectedItem.id)}`}>{selectedItem.title.charAt(0)}</div>
                                    <h3 className="text-center text-xl font-black uppercase italic mb-6">{selectedItem.title}</h3>
                                    <button disabled={isDeleting}  onClick={() => setIsEditing(true)} className="w-full py-4  rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50">
                                        <Edit2 size={18} className="text-orange-500 " /> Modifye non
                                    </button>
                                    <button disabled={isDeleting} onClick={handleDelete}  className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50">
                                        {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} {isDeleting ? 'Ap efase...' : 'Siprime'}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-center font-black uppercase italic mb-6 text-orange-500">Chanje non an</h3>
                                    <input  disabled={isUpdating} autoFocus type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-white/5 border border-orange-500/30 rounded-2xl px-5 py-4 text-white outline-none mb-6 focus:border-orange-500 transition-colors disabled:opacity-50" />
                                    <div className="flex gap-3">
                                        <button  disabled={isUpdating} onClick={() => setIsEditing(false)} className="flex-1 py-4 font-bold text-zinc-500 disabled:opacity-50">Anile</button>
                                        <button disabled={isUpdating} onClick={handleUpdate}  className="flex-1 py-4 bg-orange-500 btn-primary  rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50">
                                            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} anrejistre
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <BottomMenu />
        </div>
    );
};

export default LibraryPage;