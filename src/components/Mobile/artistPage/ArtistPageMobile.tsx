import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Play, Pause, ChevronLeft, Verified,
    Share2, Headset, Instagram, Twitter, Facebook, Info
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Contexts & API
import { useProfile } from '../../../context/ProfileContext';
import api from '../../../api/axios';
import { useImageColors } from "../../utils/GetColor";
import { useAudio } from '../../../provider/PlayerContext';
import { useLikes } from '../../../context/LikeContext';

// Components
import BottomMenu from '../menu/BottomMenu';
import TrackItem from './TrackItem';
import PlaylistModals from '../PlayListe/components/PlaylistModals';

const ArtistPageMobile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { allProfiles, fetchAllProfiles } = useProfile();

    // Audio Context
    const { currentSong, isPlaying, isBuffering, playSong, togglePlay, addToQueue } = useAudio();

    // States
    const [extraData, setExtraData] = useState<any>(null);
    const [allTracks, setAllTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    // Like Context
    const { isLiked, toggleLike } = useLikes();

    // States pou Playlists & Modals
    const [showActionModal, setShowActionModal] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedTrackForActions, setSelectedTrackForActions] = useState<any>(null);
    const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
    const [isAddingToQueue, setIsAddingToQueue] = useState(false);

    const artistFromContext = useMemo(() => {
        return allProfiles.find(p => p.id === id || p.username === id);
    }, [allProfiles, id]);

    // 1. Fetch Done Atis
    useEffect(() => {
        const fetchFullDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                if (allProfiles.length === 0) await fetchAllProfiles(1, 20);
                const { data } = await api.get(`/profiles/p/${id}`);
                setExtraData(data);

                const formattedTracks = data.tracks?.map((t: any) => ({
                    ...t,
                    artist: data.username
                })) || [];
                setAllTracks(formattedTracks);
            } catch (error) {
                console.error("Erè nan chaje done atis la:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFullDetails();
    }, [id, allProfiles.length, fetchAllProfiles]);

    const displayData = extraData || artistFromContext;
    const artistImg = displayData?.bannerUrl || displayData?.avatarUrl || "https://via.placeholder.com/800x400";

    // 2. Koulè dinamik & Scroll
    const { bgColor, imgRef } = useImageColors(artistImg);
    const { scrollY } = useScroll();

    // 3. EFFECT POU THEME-COLOR (PWA Optimized)
    useEffect(() => {
        const themeColor = isScrolled ? "#121212" : (bgColor || "#121212");
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', themeColor);
        return () => meta?.setAttribute('content', '#121212');
    }, [isScrolled, bgColor]);

    // 4. Lojik Playlists
    const fetchMyPlaylists = async () => {
        try {
            const { data } = await api.get('/playlists/me');
            setUserPlaylists(data);
        } catch (error) {
            console.error("Erè playlists:", error);
        }
    };

    const handleOpenPlaylistSelection = () => {
        fetchMyPlaylists();
        setShowPlaylistModal(true);
    };

    // 5. Memoized States
    const isThisArtistPlaying = useMemo(() => {
        return allTracks.some(t => t.id === currentSong?.id) && isPlaying;
    }, [allTracks, currentSong, isPlaying]);

    const totalPlays = useMemo(() => {
        return allTracks.reduce((acc, track) => acc + (track.playCount || 0), 0);
    }, [allTracks]);

    // 6. Audio Handlers
    const handleHeroPlay = () => {
        if (allTracks.length > 0) {
            const isArtistInQueue = allTracks.some(t => t.id === currentSong?.id);
            if (isArtistInQueue) togglePlay();
            else playSong(allTracks[0], allTracks);
        }
    };

    const handleTrackClick = (track: any) => {
        if (currentSong?.id === track.id) togglePlay();
        else playSong(track, allTracks);
    };

    const handleOpenMenu = (e: React.MouseEvent, track: any) => {
        e.stopPropagation();
        setSelectedTrackForActions(track);
        setShowActionModal(true);
        fetchMyPlaylists();
    };

    // 7. Animations
    const headerOpacity = useTransform(scrollY, [0, 250], [1, 0]);
    const navOpacity = useTransform(scrollY, [200, 300], [0, 1]);
    const bannerScale = useTransform(scrollY, [-100, 0, 100], [1.2, 1, 1]);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => setIsScrolled(latest > 280));
        return () => unsubscribe();
    }, [scrollY]);

    if (loading && !displayData) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-orange-500 font-black italic animate-pulse">H-MIZIK...</div>;
    if (!displayData) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white font-bold">Atis pa jwenn.</div>;

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans relative overflow-x-hidden">

            {/* NAV BAR */}
            <motion.nav
                style={{ backgroundColor: bgColor, opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-4"
            >
                <div className="flex items-center gap-4">
                    <ChevronLeft size={24} onClick={() => navigate(-1)} className="cursor-pointer" />
                    <div className="flex items-center gap-1.5 truncate w-40">
                        <h2 className="text-sm font-black uppercase tracking-tighter truncate">{displayData.username}</h2>
                        {displayData.verified && <Verified size={14} className="text-blue-400 fill-blue-400 flex-shrink-0" />}
                    </div>
                </div>
                <Share2 size={20} className="mr-2" />
            </motion.nav>

            {/* BANNER */}
            <div className="absolute top-0 left-0 right-0 h-[50vh] overflow-hidden z-0">
                <motion.img
                    style={{ scale: bannerScale }}
                    src={artistImg}
                    ref={imgRef}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#121212]" />
            </div>

            <main className="relative z-10">
                {/* HERO INFO */}
                <motion.div style={{ opacity: headerOpacity }} className="h-[50vh] flex flex-col justify-end px-6 pb-8 text-left">
                    <div className="flex items-center gap-1.5 mb-2">
                        {displayData.verified && <Verified size={18} className="text-blue-400 fill-blue-400" />}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Atis Ofisyèl</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter mb-2 uppercase italic leading-[0.8] break-words">
                        {displayData.username}
                    </h1>

                    <div className="flex gap-4 mb-5 text-white/60">
                        <Instagram size={20} className="active:text-pink-500 transition-colors" />
                        <Twitter size={20} className="active:text-blue-400 transition-colors" />
                        <Facebook size={20} className="active:text-blue-600 transition-colors" />
                    </div>

                    <div className="flex gap-5">
                        <div className="flex flex-col text-center">
                            <span className="text-lg font-black">{totalPlays.toLocaleString()}</span>
                            <span className="text-[8px] uppercase font-bold tracking-widest text-orange-500">Koute</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-lg font-black">{allTracks.length}</span>
                            <span className="text-[8px] uppercase font-bold tracking-widest text-orange-500">Mizik</span>
                        </div>
                    </div>
                </motion.div>

                {/* STICKY PLAY div */}
                <div className={`sticky top-16 z-40 px-6 py-4 transition-all duration-500 ${isScrolled ? 'bg-[#121212]/95 backdrop-blur-xl border-b border-white/5' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div className="px-10 py-3 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition">
                            Suivre
                        </div>
                        <div onClick={handleHeroPlay} className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer">
                            {isThisArtistPlaying ? <Pause size={30} fill="black" className="text-black" /> : <Play size={30} fill="black" className="text-black ml-1" />}
                        </div>
                    </div>
                </div>

                {/* LIST MIZIK */}
                <div style={{ background: `linear-gradient(to bottom, transparent, ${bgColor}10, #121212)` }} className="px-4 pt-8 pb-10">
                    <h3 className="px-2 text-lg font-black italic uppercase tracking-tighter flex items-center gap-2 mb-6 text-left">
                        <Headset className="text-orange-600" size={18} /> Popilè
                    </h3>
                    <div className="space-y-1">
                        {allTracks.map((track, index) => (
                            <TrackItem
                                key={track.id}
                                track={track}
                                index={index}
                                isActive={currentSong?.id === track.id}
                                isPlaying={isPlaying && currentSong?.id === track.id}
                                isBuffering={isBuffering && currentSong?.id === track.id}
                                onPlay={() => handleTrackClick(track)}
                                onOpenMenu={(e) => handleOpenMenu(e, track)}
                                isLiked={isLiked(track.id)}
                                onToggleLike={() => toggleLike(track.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* --- SEKSYON A PROPOS (REMETE) --- */}
                <div className="px-6 pb-40">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2 mb-4">
                            <Info className="text-orange-600" size={20} /> À propos
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                             <img src={displayData.avatarUrl} className="w-16 h-16 rounded-full object-cover border-2 border-orange-600" alt={displayData.username} />
                             <div>
                                 <p className="text-sm font-bold">{displayData.username}</p>
                                 <p className="text-[10px] text-white/50 uppercase tracking-widest">{totalPlays.toLocaleString()} Auditeurs</p>
                             </div>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed italic line-clamp-4">
                            {displayData.bio || `Dekouvri linivè mizikal ${displayData.username} sou H-MIZIK. Swiv atis sa a pou w pa manke anyen nan nouvèl li yo.`}
                        </p>
                        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-orange-500 border-b border-orange-500/30 pb-1">
                            Li plis
                        </div>
                    </div>
                </div>
            </main>

            <PlaylistModals
                showAction={showActionModal}
                setShowAction={setShowActionModal}
                showPlaylist={showPlaylistModal}
                setShowPlaylist={setShowPlaylistModal}
                song={selectedTrackForActions}
                isAdding={isAddingToQueue}
                userPlaylists={userPlaylists}
                onOpenPlaylistSelection={handleOpenPlaylistSelection}
                onAddToQueue={async () => {
                    if (!selectedTrackForActions) return;
                    setIsAddingToQueue(true);
                    await addToQueue(selectedTrackForActions);
                    setTimeout(() => { setIsAddingToQueue(false); setShowActionModal(false); }, 500);
                }}
            />

            <BottomMenu />
        </div>
    );
};

export default ArtistPageMobile;