import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Play, Heart, Download, ChevronLeft, Pause, Loader2, ListPlus, PlusSquare, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';
import { useImageColors } from "../../utils/GetColor";
import { useTracks } from '../../../context/TrackContext';
import { useAudio } from '../../../provider/PlayerContext';
import { useLikes } from '../../../context/LikeContext';
import AddToPlaylistModal from '../Modal/AddToPlaylistModal';
import Equalizer from '../../buffer/Equalizer';
// AJOUTE SA
import { useOfflineDownload } from '../hooks/useOfflineDownload';

// --- TIP POU SONG NAN ---
interface Song {
    id: string;
    title: string;
    artist?: { username: string } | string;
    coverUrl: string;
    audioUrl: string;
    genre?: string;
}

const PlaylistPage = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    const navigate = useNavigate();
    const { tracks } = useTracks();

    const { playSong, isPlaying, currentSong, togglePlay, isBuffering, addToQueue } = useAudio();
    const { isLiked, toggleLike } = useLikes();

    // AJOUTE SA YO
    const { downloadTrack, isOffline } = useOfflineDownload();
    const [offlineTracks, setOfflineTracks] = useState<string[]>([]);
    const [downloadingTracks, setDownloadingTracks] = useState<string[]>([]);

    const [showActionModal, setShowActionModal] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForActions, setSelectedSongForActions] = useState<Song | null>(null);
    const [isAddingToQueue, setIsAddingToQueue] = useState(false);

    const selectedTrack = useMemo(() => tracks.find(t => t.id === id), [tracks, id]);
    const isCurrentTrackPlaying = useMemo(() => isPlaying && currentSong?.id === selectedTrack?.id, [isPlaying, currentSong, selectedTrack]);
    const isMainTrackLiked = selectedTrack ? isLiked(selectedTrack.id) : false;

    const suggestions = useMemo(() => {
        if (!selectedTrack) return [];
        return tracks.filter(t => t.genre === selectedTrack.genre && t.id !== selectedTrack.id).slice(0, 15);
    }, [tracks, selectedTrack]);

    const { bgColor, imgRef } = useImageColors(selectedTrack?.coverUrl || "");
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    const imgOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const imgScale = useTransform(scrollY, [0, 200], [1, 0.8]);
    const navOpacity = useTransform(scrollY, [150, 250], [0, 1]);

    // FONKSYON DOWNLOAD KI GEN LOADING LAN
    const handleDownloadTrack = async (song: Song) => {
        if (downloadingTracks.includes(song.id)) return;
        setDownloadingTracks(prev => [...prev, song.id]);
        try {
            // PASSE 3 PARAMÈT YO: Audio, Cover, Title
            await downloadTrack(song.audioUrl, song.coverUrl, song.title);

            // Mete l nan lis offline a pou icon nan chanje an vè (green)
            setOfflineTracks(prev => [...prev, song.id]);
            setOfflineTracks(prev => [...prev, song.id]);
        } finally {
            setDownloadingTracks(prev => prev.filter(tId => tId !== song.id));
        }
    };

    // TCHEKE STATUS OFFLINE YO LÈ PAJ LA CHACHE
    useEffect(() => {
        const checkAllOfflineStatus = async () => {
            const list = [];
            const allTracksInPage = selectedTrack ? [selectedTrack, ...suggestions] : suggestions;
            for (const track of allTracksInPage) {
                if (await isOffline(track.audioUrl)) {
                    list.push(track.id);
                }
            }
            setOfflineTracks(list);
        };
        checkAllOfflineStatus();
    }, [selectedTrack, suggestions]);

    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', bgColor || '#121212');
        const unsubscribe = scrollY.on("change", (latest) => setIsScrolled(latest > 200));
        return () => {
            unsubscribe();
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#121212');
        };
    }, [bgColor, scrollY]);

    const triggerVibration = (pattern: number | number[] = 10) => {
        if (typeof window !== 'undefined' && window.navigator.vibrate) window.navigator.vibrate(pattern);
    };

    const openActionMenu = (e: React.MouseEvent, song: Song) => {
        e.stopPropagation();
        setSelectedSongForActions(song);
        setShowActionModal(true);
        triggerVibration(15);
    };

    const handleAddToQueue = async () => {
        if (!selectedSongForActions || isAddingToQueue) return;
        setIsAddingToQueue(true);
        triggerVibration(20);
        await addToQueue(selectedSongForActions);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsAddingToQueue(false);
        setShowActionModal(false);
    };

    if (!selectedTrack) return null;

    return (
        <div className="bg-[#121212] text-white font-sans relative overflow-x-hidden min-h-screen">
            {/* NAVBAR STICKY */}
            <motion.nav
                style={{ backgroundColor: bgColor, opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center px-4 gap-4"
            >
                <ChevronLeft size={24} onClick={() => navigate(-1)} className="cursor-pointer" />
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src={selectedTrack.coverUrl} className="w-8 h-8 rounded-sm object-cover" alt="mini" />
                    <h2 className="text-sm font-black truncate">{selectedTrack.title}</h2>
                </div>
            </motion.nav>

            <div className="absolute top-0 left-0 right-0 h-[50vh] z-0" style={{ background: `linear-gradient(to bottom, ${bgColor || '#333'} 0%, #121212 100%)` }} />

            <main className="relative z-10 pt-12">
                <motion.div style={{ opacity: imgOpacity, scale: imgScale }} className="flex flex-col items-center px-6 pb-6 pt-6">
                    <div className="w-52 h-52 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                        <img ref={imgRef} src={selectedTrack.coverUrl} alt={selectedTrack.title} className="w-full h-full object-cover rounded-sm" />
                    </div>
                    <div className="w-full">
                        <h3 className="text-2xl font-black mb-2 tracking-tight line-clamp-2 uppercase italic">{selectedTrack.title}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">H</div>
                            <span className="text-xs font-bold text-white/80 uppercase">
                                {typeof selectedTrack.artist === 'string' ? selectedTrack.artist : selectedTrack.artist?.username} • {selectedTrack.genre}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* CONTROLS */}
                <div className={`sticky top-16 z-40 flex justify-between items-center px-6 py-4 transition-colors duration-300 ${isScrolled ? 'bg-[#121212]' : 'bg-transparent'}`}>
                    <div className="flex items-center gap-6 text-zinc-400">
                        <motion.div whileTap={{ scale: 0.8 }} onClick={() => { toggleLike(selectedTrack.id); triggerVibration(15); }} className="cursor-pointer p-1">
                            <Heart size={28} className={`transition-all duration-300 ${isMainTrackLiked ? 'fill-orange-500 text-orange-500' : 'hover:text-white'}`} />
                        </motion.div>

                        {/* BOUTON DOWNLOAD NAN HEADER */}
                        <div onClick={() => handleDownloadTrack(selectedTrack)} className="cursor-pointer">
                            {downloadingTracks.includes(selectedTrack.id) ? (
                                <Loader2 size={24} className="text-orange-500 animate-spin" />
                            ) : (
                                <Download size={24} className={offlineTracks.includes(selectedTrack.id) ? 'text-green-500' : 'hover:text-white'} />
                            )}
                        </div>

                        <MoreVertical size={24} className="hover:text-white transition cursor-pointer" onClick={(e) => openActionMenu(e, selectedTrack)} />
                    </div>

                    <div onClick={() => currentSong?.id === selectedTrack?.id ? togglePlay() : playSong(selectedTrack, [selectedTrack, ...suggestions])} className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer shadow-orange-500/20">
                        {isCurrentTrackPlaying ? <Pause size={28} className="fill-black text-black" /> : <Play size={28} className="fill-black text-black ml-1" />}
                    </div>
                </div>

                {/* SUGGESTIONS */}
                <div className="px-4 mt-8 space-y-1 pb-40">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic mb-4 px-2">Menm jan ak sa</h3>
                    {suggestions.map((track, index) => {
                        const isThisTrackActive = currentSong?.id === track.id;
                        const isThisTrackOffline = offlineTracks.includes(track.id);
                        const isThisTrackDownloading = downloadingTracks.includes(track.id);

                        return (
                            <div key={track.id} className={`flex items-center gap-4 p-2 rounded-xl transition active:bg-white/10 ${isThisTrackActive ? 'bg-white/5' : 'hover:bg-white/5'}`}>

                                {/* 1. NIMEWO OUBYEN EQUALIZER */}
                                <div className="text-xs text-zinc-500 w-5 flex justify-center font-bold">
                                    {isThisTrackActive && isBuffering ? (
                                        <Loader2 size={14} className="text-orange-500 animate-spin" />
                                    ) : isThisTrackActive && isPlaying ? (
                                        <Equalizer />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>

                                {/* 2. COVER IMAGE KI AJOUTE A */}
                                <div className="relative w-10 h-10 flex-shrink-0 cursor-pointer" onClick={() => isThisTrackActive ? togglePlay() : playSong(track, suggestions)}>
                                    <img
                                        src={track.coverUrl}
                                        alt={track.title}
                                        className={`w-full h-full object-cover rounded-md shadow-md ${isThisTrackActive ? 'opacity-80' : 'opacity-100'}`}
                                    />
                                    {isThisTrackActive && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                                            {isPlaying ? <Pause size={14} className="text-white fill-white" /> : <Play size={14} className="text-white fill-white ml-0.5" />}
                                        </div>
                                    )}
                                </div>

                                {/* 3. ENFÒMASYON SOU MIZIK LA */}
                                <div className="flex-1 overflow-hidden cursor-pointer" onClick={() => isThisTrackActive ? togglePlay() : playSong(track, suggestions)}>
                                    <div className="flex items-center gap-2">
                                        <h4 className={`text-sm font-bold truncate ${isThisTrackActive ? 'text-orange-500' : 'text-white'}`}>
                                            {track.title}
                                        </h4>
                                        {isThisTrackDownloading ? (
                                            <Loader2 size={12} className="text-orange-500 animate-spin" />
                                        ) : isThisTrackOffline && (
                                            <CheckCircle2 size={12} className="text-green-500" />
                                        )}
                                    </div>
                                    <p className="text-[11px] text-zinc-400 font-bold truncate uppercase tracking-tighter">
                                        {typeof track.artist === 'string' ? track.artist : track.artist?.username}
                                    </p>
                                </div>

                                {/* 4. BOUTON AKSYON YO */}
                                <div className="flex items-center gap-3">
                                    <Heart
                                        onClick={(e) => { e.stopPropagation(); toggleLike(track.id); triggerVibration(10); }}
                                        size={18}
                                        className={isLiked(track.id) ? 'fill-orange-500 text-orange-500' : 'text-zinc-500'}
                                    />
                                    <MoreVertical
                                        size={18}
                                        className="text-zinc-500 cursor-pointer"
                                        onClick={(e) => openActionMenu(e, track)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <BottomMenu />

            {/* --- MODAL --- */}
            <AnimatePresence>
                {showActionModal && selectedSongForActions && (
                    <div className="fixed inset-0 z-[200] flex items-end justify-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isAddingToQueue && setShowActionModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full bg-[#1c1c1e] rounded-t-[32px] p-6 pb-12 z-[210] border-t border-white/5">
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
                            <div className="flex items-center gap-4 mb-8">
                                <img src={selectedSongForActions.coverUrl} className="w-16 h-16 rounded-xl object-cover shadow-lg" alt="" />
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="text-white text-xl font-black truncate italic uppercase tracking-tighter">{selectedSongForActions.title}</h3>
                                    <p className="text-zinc-400 font-bold truncate uppercase tracking-widest text-xs">
                                        {typeof selectedSongForActions.artist === 'string' ? selectedSongForActions.artist : selectedSongForActions.artist?.username}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* BOUTON DOWNLOAD NAN MODAL */}
                                <button
                                    disabled={downloadingTracks.includes(selectedSongForActions.id)}
                                    onClick={() => {
                                        handleDownloadTrack(selectedSongForActions);
                                        setShowActionModal(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 active:scale-[0.98] rounded-2xl transition-all text-white disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        {downloadingTracks.includes(selectedSongForActions.id) ? (
                                            <Loader2 size={22} className="text-orange-500 animate-spin" />
                                        ) : (
                                            <Download size={22} className="text-orange-500" />
                                        )}
                                    </div>
                                    <span className="font-black text-lg italic uppercase tracking-tighter">
                                        {downloadingTracks.includes(selectedSongForActions.id) ? "Ap telechaje..." : "Telechaje pou offline"}
                                    </span>
                                </button>

                                <button
                                    disabled={isAddingToQueue}
                                    onClick={handleAddToQueue}
                                    className="w-full flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 active:scale-[0.98] rounded-2xl transition-all text-white disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        {isAddingToQueue ? <Loader2 size={22} className="text-orange-500 animate-spin" /> : <ListPlus size={22} className="text-orange-500" />}
                                    </div>
                                    <span className="font-black text-lg italic uppercase tracking-tighter">
                                        {isAddingToQueue ? "Ap ajoute..." : "Ajoute nan keu"}
                                    </span>
                                </button>

                                <button
                                    disabled={isAddingToQueue}
                                    onClick={() => { setShowActionModal(false); setTimeout(() => setShowPlaylistModal(true), 300); }}
                                    className="w-full flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 active:scale-[0.98] rounded-2xl transition-all text-white disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <PlusSquare size={22} className="text-orange-500" />
                                    </div>
                                    <span className="font-black text-lg italic uppercase tracking-tighter">Ajoute nan Playlist</span>
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

export default PlaylistPage;