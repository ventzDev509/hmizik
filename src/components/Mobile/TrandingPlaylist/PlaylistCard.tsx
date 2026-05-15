import React from 'react';
import { usePlaylists } from '../../../context/PlaylistContext';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../../provider/PlayerContext';
import Equalizer from '../../buffer/Equalizer';

interface Track {
  id: string;
  coverUrl: string;
}

interface PlaylistCardProps {
  playlist: {
    id: string;
    name: string;
    totalLikesCount: number;
    tracks: Track[];
    user: { name: string };
    _count?: { tracks: number };
  };
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const { incrementTrackPlay } = usePlaylists();
  const navigate = useNavigate();
  
  
  const { currentSong, isPlaying } = useAudio();

  
  const isThisPlaylistPlaying = isPlaying && 
    playlist.tracks?.some(track => track.id === currentSong?.id);

  const tracksToShow = playlist.tracks?.slice(0, 4) || [];
  const count = tracksToShow.length;

  const getGridClass = () => {
    switch (count) {
      case 1: return "grid-cols-1 grid-rows-1";
      case 2: return "grid-cols-2 grid-rows-1";
      case 3: return "grid-cols-2 grid-rows-2";
      case 4: return "grid-cols-2 grid-rows-2";
      default: return "grid-cols-1 grid-rows-1";
    }
  };

  const handlePlayPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.tracks && playlist.tracks.length > 0) {
      const firstTrackId = playlist.tracks[0].id;
      incrementTrackPlay(firstTrackId);
    }
  };

  return (
    <div
      className={`group relative p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isThisPlaylistPlaying 
          ? "bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60" 
          : "bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60"
      }`}
      onClick={() => navigate(`/playlist/${playlist.id}`)}
    >

      {}
      <div className={`relative aspect-square rounded-xl overflow-hidden mb-4 shadow-2xl bg-zinc-800 grid gap-[1px] ${getGridClass()}`}>
        {count > 0 ? (
          tracksToShow.map((track, index) => (
            <div
              key={track.id}
              className={`w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden ${
                count === 3 && index === 0 ? "row-span-2" : ""
              }`}
            >
              <img
               onClick={() => navigate(`/playlist/${playlist.id}`)}
                src={track.coverUrl}
                alt="track cover"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isThisPlaylistPlaying ? "scale-110 blur-[1px]" : "group-hover:scale-110"
                }`}
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="zinc-700"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
          </div>
        )}

        {}
        {isThisPlaylistPlaying && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <Equalizer/>
          </div>
        )}

        {}
        {!isThisPlaylistPlaying && (
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            onClick={handlePlayPlaylist}
          >
            <div className="bg-orange-500 p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className={`text-[11px] font-black uppercase italic tracking-tight truncate ${isThisPlaylistPlaying ? "text-orange-500" : "text-white"}`}>
            {playlist.name}
          </h3>
        </div>
        
        <p className="text-[9px] font-bold text-zinc-500 uppercase">
          {playlist.user.name}
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-2">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
            {playlist._count?.tracks || count} Tracks
          </span>
          <span className={`text-[8px] font-black uppercase italic ${isThisPlaylistPlaying ? "text-orange-400" : "text-orange-500"}`}>
            🔥 {playlist.totalLikesCount} Likes
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;