import React from 'react';
import { Play, Pause, Heart, MoreVertical, Trash2 } from 'lucide-react';
import Equalizer from '../../buffer/Equalizer';
import DownloadButton from '../DownloadButton/DownloadButton';

interface TrackItemProps {
    track: any;
    index: number;
    isActive: boolean;
    isPlaying: boolean;
    isEditMode: boolean;
    isLiked: boolean;
    albumTitle: string;
    albumCover: string;
    onPlay: () => void;
    onToggleLike: () => void;
    onDelete: (id: string) => void;
    onOpenActions: (e: React.MouseEvent, track: any) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
    track, index, isActive, isPlaying, isEditMode, isLiked, 
    albumTitle, albumCover, onPlay, onToggleLike, onDelete, onOpenActions
}) => {
    const trackImage = track.coverUrl || albumCover;

    return (
        <div className={`flex items-center gap-4 p-3 rounded-2xl transition active:bg-white/10 ${isActive ? 'bg-white/5' : ''}`}>
            
            {/* Nimewo oswa Equalizer */}
            <div className="text-xs text-zinc-600 w-5 flex justify-center font-bold">
                {isActive && isPlaying ? <Equalizer /> : <span>{index + 1}</span>}
            </div>

            {/* Foto Mizik la */}
            <div className="w-12 h-12 relative flex-shrink-0 cursor-pointer" onClick={!isEditMode ? onPlay : undefined}>
                <img src={trackImage} className="w-full h-full object-cover rounded-lg shadow-lg" alt={track.title} />
                {isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                        {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                    </div>
                )}
            </div>

            {/* Enfòmasyon Tit */}
            <div className="flex-1 overflow-hidden cursor-pointer" onClick={!isEditMode ? onPlay : undefined}>
                <h4 className={`text-sm font-black truncate italic uppercase tracking-tight ${isActive ? 'text-orange-500' : 'text-zinc-100'}`}>
                    {track.title}
                </h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase line-clamp-1">{albumTitle}</p>
            </div>

            {/* Bouton Aksyon yo */}
            <div className="flex items-center gap-4">
                {isEditMode ? (
                    <button 
                        onClick={() => onDelete(track.id)} 
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                ) : (
                    <>
                        <Heart
                            size={18}
                            onClick={onToggleLike}
                            className={`cursor-pointer transition-all ${isLiked ? "fill-orange-500 text-orange-500" : "text-zinc-600 hover:text-white"}`}
                        />
                        <DownloadButton 
                            trackId={track.id} 
                            audioUrl={track.audioUrl} 
                            coverUrl={trackImage} 
                            title={track.title} 
                        />
                        <MoreVertical 
                            size={20} 
                            className="text-zinc-600 cursor-pointer hover:text-white" 
                            onClick={(e) => onOpenActions(e, track)} 
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default React.memo(TrackItem); 