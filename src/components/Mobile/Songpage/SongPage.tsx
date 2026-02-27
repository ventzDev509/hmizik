import React, { useState, useEffect } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import img from "../../../assets/toby.webp";
import {
    ChevronDown, MoreHorizontal, Shuffle,
    SkipBack, Play, Pause, SkipForward,
    Repeat, Share2, ListMusic, Heart
} from 'lucide-react';
import { useImageColors } from "../../utils/GetColor";

interface PlayerProps {
    song: {
        id: string;
        title: string;
        artist: string;
        cover: string;
        color: string;
    };
    onClose: () => void;
}

const PlayerPage: React.FC<PlayerProps> = ({ song, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const { bgColor, imgRef } = useImageColors(img);

    useEffect(() => {
        // 1. Changer le theme-color du navigateur
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', bgColor || '#1e1e1e');
        }

        // 2. Mise à jour de l'URL avec l'ID du morceau
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('song') !== song.id) {
            const newUrl = `${window.location.pathname}?song=${song.id}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }

        // 3. Fermer le player si l'utilisateur fait "Retour" (l'ID disparaît de l'URL)
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            if (!params.has('song')) {
                onClose();
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Clean up au démontage
        return () => {
            window.removeEventListener('popstate', handlePopState);
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', '#121212');
            }

            // On retire le paramètre song si on ferme via le bouton (et non via le bouton retour)
            const params = new URLSearchParams(window.location.search);
            if (params.has('song')) {
                window.history.pushState({}, '', window.location.pathname);
            }
        };
    }, [bgColor, song.id, onClose]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 100) onClose();
    };

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="fixed inset-0 z-[1000] flex flex-col touch-none"
            style={{
                background: `linear-gradient(to bottom, ${bgColor || '#1e1e1e'} 0%, #121212 100%)`
            }}
        >
            <div className="w-full flex justify-center pt-3">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <header className="flex justify-between items-center px-6 pt-4 pb-4">
                <div onClick={onClose} className="text-white active:scale-90 transition cursor-pointer">
                    <ChevronDown size={30} />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">K ap jwe</span>
                    <span className="text-xs font-bold text-white">H-MIZIK Top Hits</span>
                </div>
                <div className="text-white active:scale-90 transition cursor-pointer">
                    <MoreHorizontal size={24} />
                </div>
            </header>

            {/* Album Art - Gwosè Redwi pou style Klasik */}
            <div className="flex-[0.8] flex mt-5 items-center justify-center px-12">
                <motion.div
                    animate={{ scale: isPlaying ? 1 : 0.92 }}
                    className="w-full aspect-square relative shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                >
                    <img
                        ref={imgRef} src={img}
                        alt={song.title}
                        className="w-full h-full object-cover rounded-sm pointer-events-none"
                    />
                </motion.div>
            </div>

            <div className="px-8 mt-8 flex justify-between items-center">
                <div className="flex flex-col gap-0.5 overflow-hidden">
                    <h1 className="text-xl font-black text-white truncate">{song.title}</h1>
                    <p className="text-md font-bold text-white/60 truncate">{song.artist}</p>
                </div>
                <Heart
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-7 h-7 transition-all ${isLiked ? 'fill-orange-500 text-orange-500 scale-110' : 'text-white/60'}`}
                />
            </div>

            <div className="px-8 mt-8">
                <div className="w-full h-1 bg-white/20 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-white w-[30%] rounded-full" />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-white/40">
                    <span>1:12</span>
                    <span>3:45</span>
                </div>
            </div>

            <div className="px-8 mt-6 flex justify-between items-center mb-10">
                <Shuffle size={20} className="text-orange-500" />
                <SkipBack size={32} className="fill-white text-white active:scale-90 transition" />
                <div
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center active:scale-95 transition"
                >
                    {isPlaying ? <Pause size={28} className="text-black fill-black" /> : <Play size={28} className="text-black fill-black ml-1" />}
                </div>
                <SkipForward size={32} className="fill-white text-white active:scale-90 transition" />
                <Repeat size={20} className="text-white/40" />
            </div>

            <footer className="px-10 pb-10 flex justify-between items-center">
                <Share2 size={18} className="text-white/50" />
                <ListMusic size={20} className="text-white/50" />
            </footer>
        </motion.div>
    );
};

export default PlayerPage;