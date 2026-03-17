import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MoreVertical, Play, Heart, ChevronLeft, Pause, Loader2, ListPlus, PlusSquare } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';
import { useImageColors } from "../../utils/GetColor";
import { useAudio } from '../../../provider/PlayerContext';
import AddToPlaylistModal from '../Modal/AddToPlaylistModal';
import Equalizer from '../../buffer/Equalizer';
import DownloadButton from '../DownloadButton/DownloadButton';
import { useAlbum } from '../../../context/AlbumContext';
import { useLikes } from '../../../context/LikeContext';

interface Song {
    id: string;
    title: string;
    artist?: { username: string } | string;
    coverUrl: string;
    audioUrl: string;
    genre?: string;
}

const AlbumDetailPage = () => {
    const [searchParams] = useSearchParams();
    const albumId = searchParams.get('id');
    const navigate = useNavigate();
    
    // Contexts
    const { isLiked, toggleLike } = useLikes();
    const { currentAlbum, getAlbum, loading, error, resetAlbumState } = useAlbum();
    const { playSong, isPlaying, currentSong, togglePlay, addToQueue } = useAudio();

    // States
    const [showActionModal, setShowActionModal] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForActions, setSelectedSongForActions] = useState<Song | null>(null);
    const [isAddingToQueue, setIsAddingToQueue] = useState(false);

    useEffect(() => {
        if (albumId) {
            getAlbum(albumId);
        }
        return () => resetAlbumState(); 
    }, [albumId]);

    // KORIJE: Nou tcheke si se yon ALBUM ki like
    const isAlbumLiked = albumId ? isLiked(albumId, 'album') : false;

    const { bgColor, imgRef } = useImageColors(currentAlbum?.coverUrl || "");
    const { scrollY } = useScroll();

    // Animasyon
    const imgOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const imgScale = useTransform(scrollY, [0, 200], [1, 0.8]);
    const navOpacity = useTransform(scrollY, [150, 250], [0, 1]);

    useEffect(() => {
        if (bgColor) {
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) metaThemeColor.setAttribute('content', bgColor);
        }
        return () => {
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#121212');
        };
    }, [bgColor]);

    const triggerVibration = (pattern: number | number[] = 10) => {
        if (typeof window !== 'undefined' && window.navigator.vibrate) window.navigator.vibrate(pattern);
    };

    const openActionMenu = (e: React.MouseEvent, song: any) => {
        e.stopPropagation();
        setSelectedSongForActions(song);
        setShowActionModal(true);
        triggerVibration(15);
    };

    const handleAddToQueue = async () => {
        if (!selectedSongForActions || isAddingToQueue) return;
        setIsAddingToQueue(true);
        triggerVibration(20);
        await addToQueue(selectedSongForActions as any);
        setIsAddingToQueue(false);
        setShowActionModal(false);
    };

    if (loading && !currentAlbum) {
        return (
            <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-orange-500" size={32} />
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Chaje Album...</p>
            </div>
        );
    }

    if (error || (!loading && !currentAlbum)) {
        return (
            <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center p-6 text-center">
                <p className="text-zinc-400 mb-4">{error || "Album sa a pa disponib"}</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-orange-600 rounded-full font-bold text-sm uppercase">Retounen</button>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] text-white font-sans relative overflow-x-hidden min-h-screen">
            {/* NAVBAR */}
            <motion.nav
                style={{ backgroundColor: bgColor, opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center px-4 gap-4 shadow-xl pointer-events-none"
            >
                <div className="pointer-events-auto flex items-center gap-4 w-full">
                    <ChevronLeft size={24} onClick={() => navigate(-1)} className="cursor-pointer" />
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={currentAlbum?.coverUrl} className="w-8 h-8 rounded-sm object-cover" alt="" />
                        <h2 className="text-sm font-black truncate uppercase italic">{currentAlbum?.title}</h2>
                    </div>
                </div>
            </motion.nav>

            <div className="absolute top-0 left-0 right-0 h-[60vh] z-0"
                style={{ background: `linear-gradient(to bottom, ${bgColor || '#333'} -20%, #121212 100%)`, opacity: 0.6 }} />

            <main className="relative z-10 pt-12">
                <motion.div style={{ opacity: imgOpacity, scale: imgScale }} className="flex flex-col items-center px-6 pb-6 pt-6 text-center">
                    <div className="w-56 h-56 mb-8 shadow-2xl">
                        <img ref={imgRef} src={currentAlbum?.coverUrl} alt={currentAlbum?.title} className="w-full h-full object-cover rounded-md shadow-2xl" />
                    </div>
                    <div className="w-full">
                        <h3 className="text-4xl font-black mb-2 tracking-tighter uppercase italic leading-tight line-clamp-2">{currentAlbum?.title}</h3>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest italic">
                                {currentAlbum?.artist?.username || 'Atis'} • {currentAlbum?.tracks?.length || 0} Mizik
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* CONTROLS */}
                <div className="flex justify-between items-center px-8 py-4 mb-4">
                    <div className="flex items-center gap-8 text-zinc-400">
                        <motion.div 
                            whileTap={{ scale: 0.8 }} 
                            onClick={() => { albumId && toggleLike(albumId, "album"); triggerVibration(15); }} 
                            className="cursor-pointer"
                        >
                            {/* KORIJE: Itilize isAlbumLiked isit la */}
                            <Heart size={28} className={`transition-all duration-300 ${isAlbumLiked ? 'fill-orange-500 text-orange-500' : 'hover:text-white'}`} />
                        </motion.div>
                        <MoreVertical size={26} className="cursor-pointer" />
                    </div>

                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => currentAlbum?.tracks?.[0] && playSong(currentAlbum.tracks[0] as any, currentAlbum.tracks as any)}
                        className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    >
                        {isPlaying && currentAlbum?.tracks?.some(t => t.id === currentSong?.id) ? <Pause size={30} className="fill-black text-black" /> : <Play size={30} className="fill-black text-black ml-1" />}
                    </motion.div>
                </div>

                {/* LIS MIZIK YO */}
                <div className="px-4 mt-4 space-y-1 pb-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic mb-6 px-4">Tracks nan Album nan</p>

                    {currentAlbum?.tracks?.map((track, index) => {
                        const isThisTrackActive = currentSong?.id === track.id;
                        const trackImage = track.coverUrl || currentAlbum.coverUrl;
                        const isThisTrackLiked = isLiked(track.id, 'track'); // Tcheke chak track si yo like

                        return (
                            <div key={track.id} className={`flex items-center gap-4 p-3 rounded-2xl transition active:bg-white/10 ${isThisTrackActive ? 'bg-white/5' : ''}`}>
                                <div className="text-xs text-zinc-600 w-5 flex justify-center font-bold">
                                    {isThisTrackActive && isPlaying ? <Equalizer /> : <span>{index + 1}</span>}
                                </div>

                                <div className="w-12 h-12 relative flex-shrink-0" onClick={() => isThisTrackActive ? togglePlay() : playSong(track as any, currentAlbum.tracks as any)}>
                                    <img src={trackImage} className="w-full h-full object-cover rounded-lg shadow-lg" alt="" />
                                    {isThisTrackActive && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 overflow-hidden cursor-pointer" onClick={() => isThisTrackActive ? togglePlay() : playSong(track as any, currentAlbum.tracks as any)}>
                                    <h4 className={`text-sm font-black truncate italic uppercase tracking-tight ${isThisTrackActive ? 'text-orange-500' : 'text-zinc-100'}`}>
                                        {track.title}
                                    </h4>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase line-clamp-1">{currentAlbum.title}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Kè pou chak track si w vle l parèt nan lis la */}
                                    <Heart 
                                        size={18} 
                                        onClick={() => toggleLike(track.id, 'track')}
                                        className={isThisTrackLiked ? "fill-orange-500 text-orange-500" : "text-zinc-600"} 
                                    />
                                    <DownloadButton trackId={track.id} audioUrl={track.audioUrl} coverUrl={trackImage} title={track.title} />
                                    <MoreVertical size={20} className="text-zinc-600 cursor-pointer" onClick={(e) => openActionMenu(e, track)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <BottomMenu />

            {/* MODAL ACTIONS */}
            <AnimatePresence>
                {showActionModal && selectedSongForActions && (
                    <div className="fixed inset-0 z-[200] flex items-end justify-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => !isAddingToQueue && setShowActionModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full bg-zinc-900 rounded-t-[40px] p-8 pb-14 z-[210]">
                            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />
                            <div className="flex items-center gap-5 mb-10">
                                <img src={selectedSongForActions.coverUrl || currentAlbum?.coverUrl} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="text-white text-2xl font-black truncate italic uppercase">{selectedSongForActions.title}</h3>
                                    <p className="text-zinc-500 font-bold uppercase text-xs">Album: {currentAlbum?.title}</p>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <button onClick={handleAddToQueue} className="w-full flex items-center gap-4 p-5 bg-white/5 rounded-3xl text-white active:scale-95 transition-all">
                                    {isAddingToQueue ? <Loader2 size={22} className="animate-spin text-orange-500" /> : <ListPlus size={22} className="text-orange-500" />}
                                    <span className="font-black uppercase italic text-sm">Ajoute nan keu</span>
                                </button>
                                <button onClick={() => { setShowActionModal(false); setTimeout(() => setShowPlaylistModal(true), 200); }}
                                    className="w-full flex items-center gap-4 p-5 bg-white/5 rounded-3xl text-white active:scale-95 transition-all">
                                    <PlusSquare size={22} className="text-orange-500" />
                                    <span className="font-black uppercase italic text-sm">Ajoute nan Playlist</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
                {showPlaylistModal && selectedSongForActions && (
                    <AddToPlaylistModal trackId={selectedSongForActions.id} onClose={() => { setShowPlaylistModal(false); setSelectedSongForActions(null); }} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AlbumDetailPage;