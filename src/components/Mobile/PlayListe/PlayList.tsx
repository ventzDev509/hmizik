import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Konpozan nou dekoupe yo
import PlaylistHeader from './components/PlaylistHeader';
import PlaylistControls from './components/PlaylistControls';
import SuggestionItem from './components/SuggestionItem';
import PlaylistModals from './components/PlaylistModals';
import BottomMenu from '../menu/BottomMenu';

// Hooks ak Contexts
import { useImageColors } from "../../utils/GetColor";
import { useTracks } from '../../../context/TrackContext';
import { useAudio } from '../../../provider/PlayerContext';
import { useLikes } from '../../../context/LikeContext';

const PlaylistPage = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    const navigate = useNavigate();

    const { tracks } = useTracks();
    const { isLiked, toggleLike } = useLikes();
    const {
        playSong, isPlaying, currentSong, togglePlay,
        isBuffering, addToQueue
    } = useAudio();

    // States
    const [showActionModal, setShowActionModal] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForActions, setSelectedSongForActions] = useState<any>(null);
    const [isAddingToQueue, setIsAddingToQueue] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Lojik pou jwenn mizik la ak sijesyon yo
    const selectedTrack = useMemo(() => tracks.find(t => t.id === id), [tracks, id]);

    const suggestions = useMemo(() => {
        if (!selectedTrack) return [];
        return tracks
            .filter(t => t.genre === selectedTrack.genre && t.id !== selectedTrack.id)
            .slice(0, 15);
    }, [tracks, selectedTrack]);

    // Koulè ak Animasyon
    const { bgColor, imgRef } = useImageColors(selectedTrack?.coverUrl || "");
    const { scrollY } = useScroll();
    const imgOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const imgScale = useTransform(scrollY, [0, 200], [1, 0.8]);
    const navOpacity = useTransform(scrollY, [150, 250], [0, 1]);

    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', bgColor || '#121212');

        const unsubscribe = scrollY.on("change", (latest) => setIsScrolled(latest > 200));

        return () => {
            unsubscribe();
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#121212');
        };
    }, [bgColor, scrollY]);

    const triggerVibration = (pattern: number = 10) => {
        if (window.navigator.vibrate) window.navigator.vibrate(pattern);
    };

    const handleAddToQueue = async () => {
        if (!selectedSongForActions || isAddingToQueue) return;
        setIsAddingToQueue(true);
        triggerVibration(20);
        await addToQueue(selectedSongForActions);
        setTimeout(() => {
            setIsAddingToQueue(false);
            setShowActionModal(false);
        }, 800);
    };

    if (!selectedTrack) return null;

    return (
        <div className="bg-[#121212] text-white font-sans relative overflow-x-hidden min-h-screen">

            {/* 1. NAVBAR STICKY */}
            <motion.nav
                style={{ backgroundColor: bgColor, opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center px-4 gap-4 pointer-events-none"
            >
                <div className="pointer-events-auto flex items-center gap-4 w-full">
                    <ChevronLeft size={24} onClick={() => navigate(-1)} className="cursor-pointer" />
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={selectedTrack.coverUrl} className="w-8 h-8 rounded-sm object-cover shadow-lg" alt="" />
                        <h2 className="text-sm font-black truncate uppercase italic tracking-tighter">
                            {selectedTrack.title}
                        </h2>
                    </div>
                </div>
            </motion.nav>

            {/* Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[50vh] z-0"
                style={{ background: `linear-gradient(to bottom, ${bgColor || '#333'} 0%, #121212 100%)` }} />

            <main className="relative z-10 pt-10">
                {/* 2. Header (Foto + Tit) */}
                <PlaylistHeader
                    track={selectedTrack}
                    imgOpacity={imgOpacity}
                    imgScale={imgScale}
                    imgRef={imgRef}
                />

                {/* 3. Controls (Play/Like/Download Sticky) */}
                <PlaylistControls
                    track={selectedTrack}
                    isScrolled={isScrolled}
                    isLiked={isLiked(selectedTrack.id)}
                    isPlaying={isPlaying && currentSong?.id === selectedTrack.id}
                    onToggleLike={() => { toggleLike(selectedTrack.id); triggerVibration(15); }}
                    onPlayToggle={() => currentSong?.id === selectedTrack?.id ? togglePlay() : playSong(selectedTrack, [selectedTrack, ...suggestions])}
                    onOpenMenu={(_) => {
                        setSelectedSongForActions(selectedTrack);
                        setShowActionModal(true);
                        triggerVibration(15);
                    }}
                />

                {/* 4. Lis Sijesyon yo */}
                <div className="px-4 mt-8 space-y-1 pb-40">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic mb-6 px-2 opacity-60">
                        Menm jan ak sa
                    </h3>
                    {suggestions.map((track, index) => (
                        <SuggestionItem
                            key={track.id}
                            track={track}
                            index={index}
                            isActive={currentSong?.id === track.id}
                            isPlaying={isPlaying}
                            isBuffering={isBuffering}
                            isLiked={isLiked(track.id)}
                            onPlay={() => playSong(track, suggestions)}
                            onToggleLike={() => { toggleLike(track.id); triggerVibration(10); }}
                            onOpenMenu={(e) => {
                                e.stopPropagation();
                                setSelectedSongForActions(track);
                                setShowActionModal(true);
                                triggerVibration(15);
                            }}
                        />
                    ))}
                </div>
            </main>

            <BottomMenu />

            {/* 5. Modals */}
            <PlaylistModals
                showAction={showActionModal}
                setShowAction={setShowActionModal}
                showPlaylist={showPlaylistModal}
                setShowPlaylist={setShowPlaylistModal}
                song={selectedSongForActions}
                isAdding={isAddingToQueue}
                onAddToQueue={handleAddToQueue}
            />
        </div>
    );
};

export default PlaylistPage;