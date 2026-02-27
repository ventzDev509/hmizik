import React, { createContext, useContext, useRef, useState, useEffect } from "react";

interface Song {
    id: string;
    title: string;
    artist: string;
    cover: string;
    src: string;
}

interface AudioContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number;
    currentTime: number;
    duration: number;
    volume: number;
    playSong: (song: Song) => void;
    togglePlay: () => void;
    seek: (value: number) => void;
    setVolume: (value: number) => void;
    next: () => void;
    prev: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.5);

    // Charger audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = 0.5;
        }

        const audio = audioRef.current;
        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
            setProgress((audio.currentTime / (audio.duration || 1)) * 100);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", () => setIsPlaying(false));

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
        };
    }, []);

    const playSong = (song: Song) => {
        const audio = audioRef.current;
        if (!audio) return;
        setCurrentSong(song);
        audio.src = song.src;
        audio.play();
        setIsPlaying(true);
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const seek = (value: number) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = (audio.duration * value) / 100;
        setProgress(value);
    };

    const setVolume = (value: number) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = value;
        setVolumeState(value);
    };

    const next = () => {
        // gérer playlist plus tard
        console.log("Next song…");
    };

    const prev = () => {
        // gérer playlist plus tard
        console.log("Previous song…");
    };

    return (
        <AudioContext.Provider
            value={{
                currentSong,
                isPlaying,
                progress,
                currentTime,
                duration,
                volume,
                playSong,
                togglePlay,
                seek,
                setVolume,
                next,
                prev,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within AudioProvider");
    return context;
};
