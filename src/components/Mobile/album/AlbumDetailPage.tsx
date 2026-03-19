import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Loader2, Play, Pause, Heart, MoreVertical, Edit3, Save, X, PlusSquare } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Konpozan nou dekoupe yo
import AlbumHeader from './AlbumHeader';
import TrackItem from './TrackItem';
import AlbumModals from './AlbumModals';
import BottomMenu from '../menu/BottomMenu';

// Hooks ak Contexts
import { useImageColors } from "../../utils/GetColor";
import { useAudio } from '../../../provider/PlayerContext';
import { useAlbum } from '../../../context/AlbumContext';
import { useLikes } from '../../../context/LikeContext';
import { useAuth } from '../../../context/AuthContext';

const AlbumDetailPage = () => {
    const [searchParams] = useSearchParams();
    const albumId = searchParams.get('id');
    const navigate = useNavigate();

    const { isLiked, toggleLike } = useLikes();

    const {
        currentAlbum, getAlbum, loading, isUploading,
        resetAlbumState, updateAlbum, deleteTrack
    } = useAlbum();
    const { playSong, isPlaying, currentSong, addToQueue, togglePlay } = useAudio();
    const { user } = useAuth();

    // States pou Modifikasyon
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // States pou Modals
    const [showActionModal, setShowActionModal] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForActions, setSelectedSongForActions] = useState<any>(null);

    const isOwner = currentAlbum?.artist?.id === user?.profile?.id;


    const [localIsLiked, setLocalIsLiked] = useState(false);

    // 2. Senkronize li ak valè reyèl la lè album nan chaje
    useEffect(() => {
        if (albumId) {
            setLocalIsLiked(isLiked(albumId, 'album'));
        }
    }, [albumId, currentAlbum]);

    // 3. Fonksyon pou klike a
    const handleLikeClick = () => {
        if (!albumId) return;

        // Chanje UI a imedyatman san tann
        setLocalIsLiked(!localIsLiked);
        triggerVibration(15);

        // Rele fonksyon reyèl la an background
        toggleLike(albumId, "album");
    };
    useEffect(() => {
        if (albumId) getAlbum(albumId);
        return () => resetAlbumState();
    }, [albumId]);

    useEffect(() => {
        if (currentAlbum) {
            setEditedTitle(currentAlbum.title);
            setPreviewUrl(currentAlbum.coverUrl);
        }
    }, [currentAlbum]);

    // Koulè ak Animasyon Scroll
    const { bgColor, imgRef } = useImageColors(previewUrl || currentAlbum?.coverUrl || "");
    const { scrollY } = useScroll();
    const imgOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const imgScale = useTransform(scrollY, [0, 200], [1, 0.8]);
    const navOpacity = useTransform(scrollY, [150, 250], [0, 1]);

    const triggerVibration = (pattern: number = 10) => {
        if (window.navigator.vibrate) window.navigator.vibrate(pattern);
    };



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateAlbum = async () => {
        if (!editedTitle.trim() || !albumId) return;
        const formData = new FormData();
        formData.append('title', editedTitle);
        if (selectedFile) formData.append('cover', selectedFile);

        try {
            await updateAlbum(albumId, formData);
            setIsEditMode(false);
            setSelectedFile(null);
            triggerVibration(20);
        } catch (err) {
            alert("Erè nan sovgad la");
        }
    };

    if (loading && !currentAlbum) {
        return (
            <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-orange-500" size={32} />
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">Chaje Album...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] text-white font-sans relative overflow-x-hidden min-h-screen pb-32">

            {/* 1. Navbar Fiks */}
            <motion.nav
                style={{ backgroundColor: bgColor, opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center px-4 gap-4 shadow-xl pointer-events-none"
            >
                <div className="pointer-events-auto flex items-center gap-4 w-full">
                    <ChevronLeft size={24} onClick={() => navigate(-1)} className="cursor-pointer" />
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={previewUrl || currentAlbum?.coverUrl} className="w-8 h-8 rounded-sm object-cover" alt="" />
                        <h2 className="text-sm font-black truncate uppercase italic">{currentAlbum?.title}</h2>
                    </div>
                </div>
            </motion.nav>

            {/* Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[60vh] z-0"
                style={{ background: `linear-gradient(to bottom, ${bgColor || '#333'} -20%, #121212 100%)`, opacity: 0.6 }} />

            <main className="relative z-10 pt-12">
                {/* 2. Album Header (Foto + Tit) */}
                <AlbumHeader
                    album={currentAlbum}
                    isEditMode={isEditMode}
                    editedTitle={editedTitle}
                    setEditedTitle={setEditedTitle}
                    previewUrl={previewUrl}
                    onFileChange={handleFileChange}
                    imgRef={imgRef}
                    imgOpacity={imgOpacity}
                    imgScale={imgScale}
                    bgColor={bgColor}
                />

                {/* 3. Kontwòl Prensipal (Play/Like) */}
                <div className="flex justify-between items-center px-8 py-4 mb-4">
                    <div className="flex items-center gap-8 text-zinc-400">
                        <motion.div whileTap={{ scale: 0.8 }} onClick={handleLikeClick} className="cursor-pointer">
                            <Heart
                                size={28}
                                className={localIsLiked ? 'fill-orange-500 text-orange-500' : 'text-zinc-400'}
                            />
                        </motion.div>


                        <MoreVertical size={26} className="cursor-pointer" />
                    </div>

                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            if (isEditMode) return; // Pa fè anyen si n ap modifye

                            const isThisAlbumPlaying = currentAlbum?.tracks?.some(t => t.id === currentSong?.id);

                            if (isThisAlbumPlaying) {
                                // Si album sa a t ap jwe deja, jis fè l sispann oswa kontinye
                                togglePlay();
                            } else if (currentAlbum?.tracks?.[0]) {
                                // Si se yon lòt bagay ki t ap jwe, kòmanse premye mizik album sa a
                                playSong(currentAlbum.tracks[0] as any, currentAlbum.tracks as any);
                            }
                        }}
                        className={`w-16 h-16 ${isEditMode ? 'bg-zinc-800 opacity-50 cursor-not-allowed' : 'bg-orange-600'} rounded-full flex items-center justify-center shadow-lg cursor-pointer`}
                    >
                        {isPlaying && currentAlbum?.tracks?.some(t => t.id === currentSong?.id)
                            ? <Pause size={30} className="fill-black text-black" />
                            : <Play size={30} className="fill-black text-black ml-1" />
                        }
                    </motion.div>
                </div>

                {/* 4. Lis Mizik yo */}
                <div className="px-4 mt-4 space-y-1">
                    {currentAlbum?.tracks?.map((track, index) => (
                        <TrackItem
                            key={track.id}
                            track={track}
                            index={index}
                            isActive={currentSong?.id === track.id}
                            isPlaying={isPlaying}
                            isEditMode={isEditMode}
                            isLiked={isLiked(track.id, 'track')}
                            albumTitle={currentAlbum.title}
                            albumCover={currentAlbum.coverUrl}
                            onPlay={() => playSong(track as any, currentAlbum.tracks as any)}
                            onToggleLike={() => toggleLike(track.id, 'track')}
                            onDelete={deleteTrack}
                            onOpenActions={(_, t) => {
                                setSelectedSongForActions(t);
                                setShowActionModal(true);
                                triggerVibration(15);
                            }}
                        />
                    ))}
                </div>
            </main>
            <AnimatePresence>
                {isEditMode && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => navigate(`/nouvoson?albumId=${albumId}`)}
                        className="mt-6 mx-2 p-6 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 hover:border-orange-500/50 transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlusSquare size={28} className="text-orange-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black uppercase  italic text-white">Ajoute yon nouvo son</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">MP3, WAV oswa FLAC</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* 5. Floating Button pou Edit Mode */}
            {isOwner && (
                <div className="fixed bottom-44 right-6 z-[150] flex flex-col items-end gap-3">
                    <AnimatePresence>
                        {isEditMode && (
                            <motion.button
                                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                onClick={() => { setIsEditMode(false); setPreviewUrl(currentAlbum?.coverUrl || null); }}
                                className="w-12 h-12 bg-zinc-800 text-white rounded-full shadow-2xl flex items-center justify-center border border-white/10"
                            >
                                <X size={20} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => isEditMode ? handleUpdateAlbum() : setIsEditMode(true)}
                        className={`h-14 px-6 rounded-full shadow-2xl flex items-center gap-3 font-black uppercase italic text-sm transition-all ${isEditMode ? 'bg-orange-600 text-white' : 'bg-white text-black'}`}
                    >
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : isEditMode ? <><Save size={20} /> Sove</> : <><Edit3 size={20} /> Modifye</>}
                    </motion.div>
                </div>
            )}

            {/* 6. Modals */}
            <AlbumModals
                showActionModal={showActionModal}
                setShowActionModal={setShowActionModal}
                showPlaylistModal={showPlaylistModal}
                setShowPlaylistModal={setShowPlaylistModal}
                selectedTrack={selectedSongForActions}
                albumTitle={currentAlbum?.title}
                albumCover={currentAlbum?.coverUrl}
                onAddToQueue={addToQueue}
                triggerVibration={triggerVibration}
            />

            <BottomMenu />
        </div>
    );
};

export default AlbumDetailPage;