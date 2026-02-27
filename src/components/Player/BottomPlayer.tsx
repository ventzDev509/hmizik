
import {
    FiPlay,
    FiPause,
    FiSkipBack,
    FiSkipForward,
    FiVolume2,
} from "react-icons/fi";
import { useAudio } from "../../provider/PlayerContext";

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
    } = useAudio();

    // Format du temps (mm:ss)
    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="fixed z-[300] bottom-0 left-0 right-0 bg-black text-white flex items-center justify-between px-4 py-4 shadow-lg">
            {/* Infos chanson */}
            <div className="flex items-center gap-3 w-1/3">
                <img src={currentSong?.cover} alt={currentSong?.title} className="w-12 h-12 rounded" />
                <div className="flex flex-col truncate">
                    <span className="font-semibold truncate">{currentSong?.title}</span>
                    <span className="text-gray-400 text-sm truncate">{currentSong?.artist}</span>
                </div>
            </div>

            {/* Contrôles */}
            <div className="flex flex-col items-center w-1/3">
                <div className="flex items-center gap-4">
                    <button onClick={prev}><FiSkipBack size={20} /></button>
                    <button
                        className="p-2 rounded-full bg-green-500"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
                    </button>
                    <button onClick={next}><FiSkipForward size={20} /></button>
                </div>

                {/* Barre + temps */}
                <div className="flex items-center gap-2 w-full mt-2">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={progress}
                        onChange={(e) => seek(Number(e.target.value))}
                        className="w-full h-1 accent-green-500 cursor-pointer"
                    />
                    <span className="text-xs">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-1/3 justify-end">
                <FiVolume2 />
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-24 h-1 accent-green-500 cursor-pointer"
                />
            </div>
        </div>
    );
}
