import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Pause, Loader2, ListMusic, Trash2 } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../../provider/PlayerContext';
import BottomMenu from '../menu/BottomMenu';
import api from '../../../api/axios';
import { useImageColors } from '../../utils/GetColor';
import toast from 'react-hot-toast';
import Equalizer from '../../buffer/Equalizer';

const PlaylistGridCover = ({ tracks, imgRef }: { tracks: any[], imgRef: any }) => {
    const validTracks = tracks?.filter(t => t.coverUrl) || [];
    if (validTracks.length >= 4) {
        return (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full bg-zinc-900">
                {validTracks.slice(0, 4).map((t, i) => (
                    <img key={i} ref={i === 0 ? imgRef : null} src={t.coverUrl} className="w-full h-full object-cover border-[0.5px] border-black/20" alt="" />
                ))}
            </div>
        );
    }
    return (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <img ref={imgRef} src={validTracks[0]?.coverUrl || "https://picsum.photos/seed/playlist/400"} className="w-full h-full object-cover" alt="" />
        </div>
    );
};



const PlaylistDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { playSong, isPlaying, currentSong, togglePlay, isBuffering } = useAudio();

    const [playlist, setPlaylist] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startY = useRef<number>(0);

    const mainCover = useMemo(() => {
        if (playlist?.coverUrl && playlist.coverUrl !== "https://picsum.photos/seed/playlist/400") return playlist.coverUrl;
        return playlist?.tracks?.[0]?.coverUrl || null;
    }, [playlist]);

    const { bgColor, imgRef } = useImageColors(mainCover);
    const themeColor = bgColor || '#121212';

    useEffect(() => {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', themeColor);
        return () => { metaThemeColor?.setAttribute('content', '#121212'); };
    }, [themeColor]);

    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 250], [1, 0]);
    const headerScale = useTransform(scrollY, [0, 250], [1, 0.8]);

    useEffect(() => {
        const unsubscribe = scrollY.onChange((latest) => {
            setIsScrolled(latest > 250);
        });
        return () => unsubscribe();
    }, [scrollY]);

    const fetchPlaylistDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/playlists/${id}`);
            setPlaylist(data);
        } catch (error) {
            navigate('/library');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) fetchPlaylistDetails(); }, [id]);

    const handleRemoveTrack = async () => {
        if (!selectedTrack) return;
        try {
            setIsDeleting(true);
            await api.delete(`/playlists/${id}/tracks/${selectedTrack.id}`);
            setPlaylist((prev: any) => ({
                ...prev,
                tracks: prev.tracks.filter((t: any) => t.id !== selectedTrack.id)
            }));
            toast.success("Retire");
            setSelectedTrack(null);
        } catch (error) {
            toast.error("Echèk");
        } finally {
            setIsDeleting(false);
        }
    };

    const onTouchStart = (track: any, e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        touchTimer.current = setTimeout(() => {
            setSelectedTrack(track);
            if (navigator.vibrate) navigator.vibrate(50);
        }, 800);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (Math.abs(e.touches[0].clientY - startY.current) > 10) {
            clearTimeout(touchTimer.current!);
            touchTimer.current = null;
        }
    };

    const onTouchEnd = () => {
        if (touchTimer.current) clearTimeout(touchTimer.current);
    };

    const isThisPlaylistActive = useMemo(() => 
        playlist?.tracks?.some((t: any) => t.id === currentSong?.id), 
    [playlist, currentSong]);

    if (loading) return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
            <Loader2 size={40} className="text-orange-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen text-white relative pb-40 overflow-x-hidden select-none" style={{ backgroundColor: themeColor }}>
            
            {/* OVERLAY AJISTE (PA TROP WO) */}
            <div className="absolute top-0 inset-x-0 bottom-0 bg-gradient-to-b from-black/60 via-black/20 to-[#121212] z-0 pointer-events-none" />

            <motion.nav 
                initial={false}
                // NAVBAR PRAN BGCOLOR LÈ LI SCROLL
                animate={{ backgroundColor: isScrolled ? themeColor : 'rgba(0,0,0,0)' }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center px-4  transition-colors duration-300"
            >
                <div onClick={() => navigate(-1)} className="p-2 cursor-pointer active:scale-75 transition-transform">
                    <ChevronLeft size={28} />
                </div>
                <AnimatePresence>
                    {isScrolled && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 ">
                            <h2 className="font-black text-[12px] uppercase italic tracking-widest truncate px-10">
                                {playlist?.name}
                            </h2>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <main className="relative z-10 pt-20 px-6">
                <motion.header style={{ opacity: headerOpacity, scale: headerScale }} className="flex flex-col items-center mb-10">
                    <div className="w-56 h-56 rounded-[2.5rem] shadow-2xl overflow-hidden mb-8 ring-1 ring-white/10">
                        {playlist?.coverUrl && playlist.coverUrl !== "https://picsum.photos/seed/playlist/400" ? (
                            <img src={playlist.coverUrl} ref={imgRef} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <PlaylistGridCover tracks={playlist?.tracks || []} imgRef={imgRef} />
                        )}
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-[0.9] mb-4 drop-shadow-2xl">{playlist?.name}</h1>
                        <p className="text-white/60 font-black text-[9px] uppercase tracking-[0.2em]">{playlist?.user?.username || 'H-Mizik'} • {playlist?.tracks?.length || 0} Mizik</p>
                    </div>
                </motion.header>

                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex gap-2">
                        <div className="h-11 px-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3">
                            <ListMusic size={16} className="text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Lis</span>
                        </div>
                    </div>

                    {/* BOUTON PLAY VIN ORANJ AK TÈKS/IKÒN NWA */}
                    <motion.div 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => isThisPlaylistActive ? togglePlay() : playlist?.tracks?.[0] && playSong(playlist.tracks[0], playlist.tracks)}
                        className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
                    >
                        <AnimatePresence mode="wait">
                            {isBuffering && isThisPlaylistActive ? (
                                <Loader2 key="l" className="text-black animate-spin" size={24} />
                            ) : (
                                <div key="i">
                                    {isPlaying && isThisPlaylistActive ? 
                                        <Pause size={24} fill="black" stroke="black" /> : 
                                        <Play size={24} fill="black" stroke="black" className="ml-1" />
                                    }
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <div className="space-y-1">
                    {playlist?.tracks?.map((track: any) => {
                        const isActive = currentSong?.id === track.id;
                        return (
                            <motion.div
                                key={track.id}
                                onTouchStart={(e) => onTouchStart(track, e)}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                onClick={() => isActive ? togglePlay() : playSong(track, playlist.tracks)}
                                className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer ${isActive ? 'bg-white/10 ring-1 ring-white/10' : 'active:bg-white/5'}`}
                            >
                                <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0">
                                    <img src={track.coverUrl} className="w-full h-full object-cover" alt="" />
                                    {isActive && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            {isBuffering ? <Loader2 size={16} className="text-orange-500 animate-spin" /> : isPlaying ? <Equalizer /> : <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-[13px] font-bold truncate ${isActive ? 'text-orange-500' : 'text-white'}`}>{track.title}</h4>
                                    <p className="text-[9px] text-white/40 uppercase font-black truncate">{track.artist}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            <AnimatePresence>
                {selectedTrack && (
                    <div className="fixed inset-0 z-[300] flex items-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTrack(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#1a1a1a] w-full rounded-t-[3rem] p-8 pb-12 relative z-10 border-t border-white/5">
                            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />
                            <div className="flex flex-col items-center mb-8">
                                <img src={selectedTrack.coverUrl} className="w-28 h-28 rounded-[2rem] shadow-2xl mb-4" alt="" />
                                <h3 className="text-xl font-black uppercase text-center italic">{selectedTrack.title}</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{selectedTrack.artist}</p>
                            </div>
                            
                            <div 
                                onClick={!isDeleting ? handleRemoveTrack : undefined} 
                                className={`w-full py-5 bg-red-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-transform ${isDeleting ? 'opacity-50' : ''}`}
                            >
                                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 size={18} />}
                                Retire nan playlist
                            </div>

                            <div onClick={() => setSelectedTrack(null)} className="w-full py-5 mt-2 text-zinc-500 font-black uppercase text-[10px] text-center cursor-pointer active:opacity-50">
                                Anile
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <BottomMenu />
        </div>
    );
};

export default PlaylistDetailPage;