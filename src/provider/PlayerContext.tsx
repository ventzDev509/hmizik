import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
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
    const playPromiseRef = useRef<Promise<void> | null>(null);

    const [queue, setQueue] = useState<Song[]>([]);
    const [originalPlaylist, setOriginalPlaylist] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(Number(localStorage.getItem('volume')) ?? 0.7);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
    const [hasCountedPlay, setHasCountedPlay] = useState(false);

    // Fonksyon pou jere MediaSession (Lock Screen)
    const updateMediaSession = useCallback((song: Song) => {
        if ('mediaSession' in navigator) {
            const artistName = typeof song.artist === 'string' ? song.artist : song.artist?.username || "Atis H-Mizik";
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: artistName,
                album: "H-Mizik Streaming",
                artwork: [{ src: song.coverUrl, sizes: '512x512', type: 'image/png' }]
            });
        }
    }, []);

    // 1. Inisyalizasyon Audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        const audio = audioRef.current;
        audio.volume = volume;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
            setProgress((audio.currentTime / (audio.duration || 1)) * 100);
        };

        const onEnded = () => {
            if (repeatMode === 'one') {
                audio.currentTime = 0;
                audio.play().catch(console.error);
            } else {
                next();
            }
        };

        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => {
            setIsBuffering(false);
            setIsPlaying(true);
        };
        const onPause = () => setIsPlaying(false);
        const onError = (e: any) => {
            console.error("Audio error:", e);
            setIsBuffering(false);
            setIsPlaying(false);
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("waiting", onWaiting);
        audio.addEventListener("playing", onPlaying);
        audio.addEventListener("pause", onPause);
        audio.addEventListener("error", onError);
        audio.addEventListener("canplay", () => setIsBuffering(false));

        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
            audio.removeEventListener("waiting", onWaiting);
            audio.removeEventListener("playing", onPlaying);
            audio.removeEventListener("pause", onPause);
            audio.removeEventListener("error", onError);
        };
    }, [repeatMode, volume]);

    // 2. Kontwa de jwèt (Increment Play)
    useEffect(() => {
        if (!currentSong || hasCountedPlay || !isPlaying) return;
        if (currentTime >= 30) {
            setHasCountedPlay(true);
            incrementPlay(currentSong.id);
        }
    }, [currentTime, currentSong, hasCountedPlay, isPlaying, incrementPlay]);

    // 3. Fonksyon Play Song - Solidifye
    const playSong = useCallback(async (song: Song, playlist: Song[] = []) => {
        const audio = audioRef.current;
        if (!audio) return;

        // Sekirite pou Play Promise (Evite error: play() request was interrupted)
        if (playPromiseRef.current) {
            await playPromiseRef.current.catch(() => {});
        }

        try {
            setIsBuffering(true);
            setHasCountedPlay(false);
            setCurrentSong(song);
            if (playlist.length > 0) setOriginalPlaylist(playlist);

            audio.src = song.audioUrl;
            audio.load();
            updateMediaSession(song);

            playPromiseRef.current = audio.play();
            await playPromiseRef.current;
            setIsPlaying(true);
        } catch (err) {
            console.error("Play Error:", err);
            setIsPlaying(false);
        } finally {
            setIsBuffering(false);
        }
    }, [updateMediaSession]);

    const togglePlay = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        try {
            if (isPlaying) {
                audio.pause();
            } else {
                playPromiseRef.current = audio.play();
                await playPromiseRef.current;
            }
        } catch (err) {
            console.error("Toggle error:", err);
        }
    }, [isPlaying, currentSong]);

    const next = useCallback(() => {
        if (queue.length > 0) {
            const nextInQueue = queue[0];
            setQueue(prev => prev.slice(1));
            playSong(nextInQueue);
            return;
        }

        if (originalPlaylist.length === 0) return;

        let currentIndex = originalPlaylist.findIndex(s => s.id === currentSong?.id);
        let nextIndex;

        if (isShuffle) {
            // Evite jwe menm mizik la si playlist la gen plis pase 1 atis
            do {
                nextIndex = Math.floor(Math.random() * originalPlaylist.length);
            } while (nextIndex === currentIndex && originalPlaylist.length > 1);
        } else {
            nextIndex = (currentIndex + 1) % originalPlaylist.length;
            // Si repeatMode se 'none' epi nou rive nan fen, nou kanpe
            if (nextIndex === 0 && repeatMode === 'none') {
                setIsPlaying(false);
                return;
            }
        }

        playSong(originalPlaylist[nextIndex]);
    }, [queue, originalPlaylist, currentSong, isShuffle, repeatMode, playSong]);

    const prev = useCallback(() => {
        if (originalPlaylist.length === 0) return;

        // Si mizik la gentan gen plis pase 3 segonn k ap jwe, prev rekòmanse mizik la
        if (currentTime > 3 && audioRef.current) {
            audioRef.current.currentTime = 0;
            return;
        }

        let currentIndex = originalPlaylist.findIndex(s => s.id === currentSong?.id);
        let prevIndex = (currentIndex - 1 + originalPlaylist.length) % originalPlaylist.length;
        playSong(originalPlaylist[prevIndex]);
    }, [originalPlaylist, currentSong, currentTime, playSong]);

    const seek = useCallback((value: number) => {
        if (!audioRef.current || !audioRef.current.duration) return;
        const time = (audioRef.current.duration * value) / 100;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }, []);

    const setVolume = useCallback((value: number) => {
        if (!audioRef.current) return;
        const safeVolume = Math.max(0, Math.min(1, value));
        audioRef.current.volume = safeVolume;
        setVolumeState(safeVolume);
        localStorage.setItem('volume', safeVolume.toString());
    }, []);

    const addToQueue = useCallback((song: Song) => {
        setQueue(prev => [...prev, song]);
    }, []);

    const removeFromQueue = useCallback((songId: string) => {
        setQueue(prev => prev.filter(s => s.id !== songId));
    }, []);

    // Konfigirasyon MediaSession Action Handlers
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', togglePlay);
            navigator.mediaSession.setActionHandler('pause', togglePlay);
            navigator.mediaSession.setActionHandler('previoustrack', prev);
            navigator.mediaSession.setActionHandler('nexttrack', next);
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.seekTime !== undefined) {
                    if (audioRef.current) audioRef.current.currentTime = details.seekTime;
                }
            });
        }
    }, [togglePlay, prev, next]);

    return (
        <AudioContext.Provider value={{
            currentSong, isPlaying, isBuffering, progress, currentTime, duration, volume,
            isShuffle, repeatMode, queue, addToQueue, removeFromQueue,
            playSong, togglePlay, seek, setVolume,
            next, prev, toggleShuffle: () => setIsShuffle(!isShuffle),
            toggleRepeat: () => {
                const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
                setRepeatMode(prev => modes[(modes.indexOf(prev) + 1) % modes.length]);
            }
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