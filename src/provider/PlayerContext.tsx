import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { useTracks } from "../context/TrackContext";

interface Song {
    id: string;
    title: string;
    artist?: { username: string } | string;
    coverUrl: string;
    audioUrl: string;
    genre?: string;
}

interface AudioContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    isBuffering: boolean;
    progress: number;
    currentTime: number;
    duration: number;
    volume: number;
    isShuffle: boolean;
    repeatMode: 'none' | 'one' | 'all';
    queue: Song[]; 
    addToQueue: (song: Song) => void;
    removeFromQueue: (songId: string) => void;
    playSong: (song: Song, playlist?: Song[]) => void;
    togglePlay: () => void;
    seek: (value: number) => void;
    setVolume: (value: number) => void;
    next: () => void;
    prev: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { incrementPlay } = useTracks();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // States pou Queue ak Playlist
    const [queue, setQueue] = useState<Song[]>([]);
    const [originalPlaylist, setOriginalPlaylist] = useState<Song[]>([]);

    // States pou jwè a
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(Number(localStorage.getItem('volume')) || 0.7);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
    const [hasCountedPlay, setHasCountedPlay] = useState(false);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        const audio = audioRef.current;
        audio.preload = "auto";
        audio.volume = volume;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
            setProgress((audio.currentTime / (audio.duration || 1)) * 100);
        };

        const handleEnded = () => {
            if (repeatMode === 'one') {
                audio.currentTime = 0;
                audio.play();
            } else {
                next();
            }
        };

        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => setIsBuffering(false);
        const onCanPlay = () => setIsBuffering(false);

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("waiting", onWaiting);
        audio.addEventListener("playing", onPlaying);
        audio.addEventListener("canplay", onCanPlay);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("waiting", onWaiting);
            audio.removeEventListener("playing", onPlaying);
            audio.removeEventListener("canplay", onCanPlay);
        };
    }, [repeatMode, queue, originalPlaylist, currentSong]);

    useEffect(() => {
        if (!currentSong || hasCountedPlay || !isPlaying) return;
        if (currentTime >= 30 && currentTime <= 32) {
            setHasCountedPlay(true);
            incrementPlay(currentSong.id);
        }
    }, [currentTime, currentSong, hasCountedPlay, isPlaying, incrementPlay]);

    const updateMediaSession = (song: Song) => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: typeof song.artist === 'string' ? song.artist : song.artist?.username || "Atis H-Mizik",
                album: "H-Mizik Streaming",
                artwork: [{ src: song.coverUrl, sizes: '512x512', type: 'image/png' }]
            });
            navigator.mediaSession.setActionHandler('play', togglePlay);
            navigator.mediaSession.setActionHandler('pause', togglePlay);
            navigator.mediaSession.setActionHandler('previoustrack', prev);
            navigator.mediaSession.setActionHandler('nexttrack', next);
        }
    };

    // --- SÈL FONKSYON PLAYSONG LAN ---
    const playSong = async (song: Song, playlist: Song[] = []) => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            audio.pause();
            setIsPlaying(false);
            setIsBuffering(true);
            setHasCountedPlay(false);

            updateMediaSession(song);
            setCurrentSong(song);
            
            // Si yo pase yon nouvo playlist, nou sove l
            if (playlist.length > 0) {
                setOriginalPlaylist(playlist);
            }

            audio.src = song.audioUrl;
            audio.load();

            audio.oncanplaythrough = async () => {
                try {
                    await audio.play();
                    setIsPlaying(true);
                    setIsBuffering(false);
                    audio.oncanplaythrough = null;
                } catch (err) {
                    console.error("Play error:", err);
                }
            };
        } catch (err) {
            console.error("Load error:", err);
        }
    };

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;
        try {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                await audio.play();
                setIsPlaying(true);
            }
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    const addToQueue = (song: Song) => {
        setQueue((prev) => [...prev, song]);
    };

    const removeFromQueue = (songId: string) => {
        setQueue((prev) => prev.filter(s => s.id !== songId));
    };

    const next = () => {
        // 1. Tcheke Queue an premye
        if (queue.length > 0) {
            const nextInQueue = queue[0];
            setQueue(prev => prev.slice(1));
            playSong(nextInQueue, originalPlaylist);
            return;
        }

        // 2. Sinon, playlist nòmal
        if (originalPlaylist.length === 0) return;

        let currentIndex = originalPlaylist.findIndex(s => s.id === currentSong?.id);
        let nextIndex;

        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * originalPlaylist.length);
        } else {
            nextIndex = (currentIndex + 1) % originalPlaylist.length;
        }

        playSong(originalPlaylist[nextIndex], originalPlaylist);
    };

    const prev = () => {
        if (originalPlaylist.length === 0) return;
        let currentIndex = originalPlaylist.findIndex(s => s.id === currentSong?.id);
        let prevIndex = (currentIndex - 1 + originalPlaylist.length) % originalPlaylist.length;
        playSong(originalPlaylist[prevIndex], originalPlaylist);
    };

    const seek = (value: number) => {
        if (!audioRef.current) return;
        const time = (audioRef.current.duration * value) / 100;
        audioRef.current.currentTime = time;
    };

    const setVolume = (value: number) => {
        if (!audioRef.current) return;
        audioRef.current.volume = value;
        setVolumeState(value);
        localStorage.setItem('volume', value.toString());
    };

    const toggleShuffle = () => setIsShuffle(!isShuffle);

    const toggleRepeat = () => {
        const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
        const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
        setRepeatMode(nextMode);
    };

    return (
        <AudioContext.Provider value={{
            currentSong, isPlaying, isBuffering, progress, currentTime, duration, volume,
            isShuffle, repeatMode, queue, addToQueue, removeFromQueue,
            playSong, togglePlay, seek, setVolume,
            next, prev, toggleShuffle, toggleRepeat
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within AudioProvider");
    return context;
};