import {
    FiPlay,
    FiPause,
    FiSkipBack,
    FiSkipForward,
    FiVolume2,
    FiRepeat,
    FiShuffle,
} from "react-icons/fi";
import { useAudio } from "../../provider/PlayerContext";
import { useState } from "react";

export default function BottomPlayer() {
    const {
        currentSong,
        isPlaying,
        progress,
        currentTime,
        duration,
        togglePlay,
        seek,
        setVolume,
        volume,
        next,
        prev,
        isShuffle,
        repeatMode,
        toggleShuffle,
        toggleRepeat
    } = useAudio();

    // Nou kreye yon eta lokal pou "drag" la pou bare a pa "stutter" lè w ap deplase l
    const [isDragging, setIsDragging] = useState(false);
    const [localProgress, setLocalProgress] = useState(0);

    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    if (!currentSong) return null;

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setLocalProgress(val);
        if (!isDragging) seek(val);
    };

    return (
        <div className="fixed z-[300] bottom-0 left-0 right-0 bg-[#000]/95 backdrop-blur-md border-t border-white/5 text-white flex items-center justify-between px-4 py-3 shadow-2xl h-20">
            
            {/* 1. SEKSYON ENFÒMASYON */}
            <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
                <div className="relative h-14 w-14 flex-shrink-0 group overflow-hidden rounded-md shadow-md">
                    <img 
                        src={currentSong?.coverUrl} 
                        alt={currentSong?.title} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-110' : 'scale-100'}`} 
                    />
                </div>
                <div className="flex flex-col truncate">
                    <span className="font-bold text-[14px] hover:underline cursor-pointer truncate leading-tight">
                        {currentSong?.title}
                    </span>
                    <span className="text-gray-400 text-[11px] hover:text-white transition cursor-pointer truncate mt-1 uppercase tracking-wider font-semibold">
                        {typeof currentSong?.artist === 'string' ? currentSong?.artist : currentSong?.artist?.username}
                    </span>
                </div>
            </div>

            {/* 2. SEKSYON KONTWÒL (SANT) */}
            <div className="flex flex-col items-center w-[40%] max-w-[700px]">
                <div className="flex items-center gap-6 mb-2">
                    <button 
                        onClick={toggleShuffle}
                        className={`transition-all duration-200 hover:scale-110 ${isShuffle ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FiShuffle size={18} />
                    </button>

                    <button onClick={prev} className="text-gray-300 hover:text-white transition-transform active:scale-90">
                        <FiSkipBack size={24} fill="currentColor" />
                    </button>

                    <button
                        className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-white/10 shadow-lg"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <FiPause size={22} fill="black" /> : <FiPlay size={22} fill="black" className="ml-1" />}
                    </button>

                    <button onClick={next} className="text-gray-300 hover:text-white transition-transform active:scale-90">
                        <FiSkipForward size={24} fill="currentColor" />
                    </button>

                    <button 
                        onClick={toggleRepeat}
                        className={`transition-all duration-200 relative hover:scale-110 ${repeatMode !== 'none' ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FiRepeat size={18} />
                        {repeatMode === 'one' && <span className="absolute -top-2 -right-2 text-[9px] font-black bg-green-500 text-black rounded-full h-3 w-3 flex items-center justify-center">1</span>}
                    </button>
                </div>

                {/* PROGRESS BAR */}
                <div className="flex items-center gap-3 w-full group h-6">
                    <span className="text-[11px] text-gray-500 min-w-[35px] text-right font-mono">
                        {formatTime(currentTime)}
                    </span>
                    
                    <div className="relative flex-1 flex items-center h-full">
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={isDragging ? localProgress : (progress || 0)}
                            onMouseDown={() => setIsDragging(true)}
                            onMouseUp={() => { setIsDragging(false); seek(localProgress); }}
                            onChange={handleSeekChange}
                            className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
                        />
                        {/* Background Track */}
                        <div className="w-full h-[4px] bg-white/20 rounded-full overflow-hidden">
                            {/* Progrès */}
                            <div 
                                className="h-full bg-white group-hover:bg-green-500 transition-colors duration-200 relative"
                                style={{ width: `${progress}%` }}
                            >
                                {/* Efè briyan sou pwent lan */}
                                <div className="absolute right-0 top-0 h-full w-[2px] bg-white shadow-[0_0_10px_white]" />
                            </div>
                        </div>
                        {/* Handle (Pwen an) */}
                        <div 
                            className="absolute h-3 w-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                            style={{ left: `calc(${progress}% - 6px)` }}
                        />
                    </div>

                    <span className="text-[11px] text-gray-500 min-w-[35px] font-mono">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* 3. VOLUME SEKSYON */}
            <div className="flex items-center gap-3 w-[30%] justify-end group/vol">
                <FiVolume2 className={`${volume === 0 ? 'text-red-500' : 'text-gray-400'} group-hover/vol:text-white transition-colors`} size={20} />
                <div className="relative w-28 flex items-center h-6">
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
                    />
                    <div className="w-full h-[4px] bg-white/20 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white group-hover/vol:bg-green-500 transition-colors duration-200"
                            style={{ width: `${volume * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}