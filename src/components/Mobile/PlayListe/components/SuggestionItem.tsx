import React from 'react';
import { Play, Pause, Heart, MoreVertical, Loader2 } from 'lucide-react';
import Equalizer from '../../../buffer/Equalizer';
import DownloadButton from '../../DownloadButton/DownloadButton';

interface SuggestionItemProps {
    track: any;
    index: number;
    isActive: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    isLiked: boolean;
    onPlay: () => void;
    onToggleLike: () => void;
    onOpenMenu: (e: React.MouseEvent) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
    track, index, isActive, isPlaying, isBuffering, isLiked, onPlay, onToggleLike, onOpenMenu
}) => {
    return (
        <div className={`flex items-center gap-4 p-2 rounded-xl transition active:bg-white/10 ${isActive ? 'bg-white/5' : 'hover:bg-white/5'}`}>
            <div className="text-xs text-zinc-500 w-5 flex justify-center font-bold">
                {isActive && isBuffering ? (
                    <Loader2 size={14} className="text-orange-500 animate-spin" />
                ) : isActive && isPlaying ? (
                    <Equalizer />
                ) : (
                    <span>{index + 1}</span>
                )}
            </div>

            <div className="relative w-10 h-10 flex-shrink-0 cursor-pointer" onClick={onPlay}>
                <img src={track.coverUrl} className="w-full h-full object-cover rounded-md shadow-md" alt="" />
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                        {isPlaying ? <Pause size={14} className="text-white fill-white" /> : <Play size={14} className="text-white fill-white ml-0.5" />}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-hidden cursor-pointer" onClick={onPlay}>
                <h4 className={`text-sm font-bold truncate ${isActive ? 'text-orange-500' : 'text-white'}`}>{track.title}</h4>
                <p className="text-[11px] text-zinc-400 font-bold truncate uppercase tracking-tighter">
                    {typeof track.artist === 'string' ? track.artist : track.artist?.username}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <DownloadButton trackId={track.id} audioUrl={track.audioUrl} coverUrl={track.coverUrl} title={track.title} />
                <Heart
                    onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
                    size={18}
                    className={isLiked ? 'fill-orange-500 text-orange-500' : 'text-zinc-500'}
                />
                <MoreVertical size={18} className="text-zinc-500 cursor-pointer" onClick={onOpenMenu} />
            </div>
        </div>
    );
};

export default React.memo(SuggestionItem);