

import { useTracks } from "../../../context/TrackContext";
import { useAudio } from "../../../provider/PlayerContext";
import { Play } from 'lucide-react';
import Equalizer from '../../buffer/Equalizer';

const TradingTrack = () => {
    const { trendingTracks, loading } = useTracks();
    const { playSong, currentSong, isPlaying } = useAudio();

    const handlePlayRequest = (track: any) => {
        
        playSong(track, trendingTracks);
    };

    return (
        <section className="grid grid-cols-2 gap-2 mb-8 p-2">
            {loading && trendingTracks.length === 0 ? (
                [1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-[#282828] animate-pulse h-14 rounded-[4px]" />
                ))
            ) : (
                trendingTracks.map((track) => {
                    const isCurrentTrack = currentSong?.id === track.id;
                    const isActuallyPlaying = isCurrentTrack && isPlaying;

                    return (
                        <div
                            key={track.id}
                            onClick={() => handlePlayRequest(track)}
                            className={`bg-[#282828] hover:bg-[#3e3e3e] transition-all duration-500 rounded-[4px] flex items-center gap-3 overflow-hidden cursor-pointer h-14 group relative ${
                                isCurrentTrack ? 'bg-[#333]' : ''
                            }`}
                        >
                            <div className="relative w-14 h-14 shrink-0">
                                <img
                                    src={track.coverUrl}
                                    alt={track.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                                    isCurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                    {isActuallyPlaying ? <Equalizer /> : <Play size={18} className="fill-white text-white" />}
                                </div>
                            </div>

                            <div className="flex flex-col truncate pr-2 flex-1">
                                <span className={`text-[11px] font-bold truncate ${
                                    isCurrentTrack ? 'text-orange-500' : 'text-white'
                                }`}>
                                    {track.title}
                                </span>
                                <span className="text-[9px] text-zinc-400 truncate uppercase">
                                    {track.playCount?.toLocaleString()} ekout
                                </span>
                            </div>
                        </div>
                    );
                })
            )}
        </section>
    );
};


export default TradingTrack;