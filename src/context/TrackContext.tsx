import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

// 1. Interface pou yon Mizik
interface Track {
    id: string;
    title: string;
    genre: string;
    audioUrl: string;
    coverUrl: string;
    duration: number;
    playCount: number; 
    artist: {
        username: string;
        user: { name: string };
    };
}

interface TrackContextType {
    uploading: boolean;
    loading: boolean;
    tracks: Track[];
    trendingTracks: Track[];
    searchResults: Track[];
    hasMore: boolean;
    uploadTrack: (formData: FormData) => Promise<void>;
    fetchTracks: (page: number) => Promise<void>;
    fetchUserTracks: (userId: string, page: number) => Promise<void>;
    fetchTrending: (limit?: number) => Promise<void>;
    searchTracks: (query: string) => Promise<void>;
    incrementPlay: (trackId: string) => Promise<void>;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [hasMore, setHasMore] = useState(true);

    // 1. UPLOAD MIZIK
    const uploadTrack = async (formData: FormData) => {
        setUploading(true);
        try {
            const response = await api.post('/tracks/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 201) {
                toast.success("Mizik la pibliye ak siksè!");
                setTracks(prev => [response.data, ...prev]);
            }
        } catch (error: any) {
            console.error("H-MIZIK UPLOAD ERROR:", error);
            toast.error(error.response?.data?.message || "Erè pandan upload la");
        } finally {
            setUploading(false);
        }
    };

    // 2. FETCH TOUT MIZIK (FEED JENERAL)
    const fetchTracks = async (page: number) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/tracks?limit=10&page=${page}`);
            if (page === 1) setTracks(data.data);
            else setTracks(prev => [...prev, ...data.data]);
            setHasMore(data.meta.hasMore);
        } catch (error) {
            console.error("H-MIZIK FETCH ERROR:", error);
            toast.error("Nou pa ka chaje mizik yo.");
        } finally {
            setLoading(false);
        }
    };

    // 3. FETCH MIZIK YON ITILIZATÈ
    const fetchUserTracks = async (userId: string, page: number) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/tracks/user/${userId}?limit=10&page=${page}`);
            if (page === 1) setTracks(data.tracks);
            else setTracks(prev => [...prev, ...data.tracks]);
            setHasMore(data.meta.hasMore);
        } catch (error) {
            console.error("H-MIZIK USER TRACKS ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    // 4. FETCH TRENDING (Sa k ap jwe plis)
    const fetchTrending = async (limit: number = 10) => {
        try {
            const { data } = await api.get(`/tracks/trending?limit=${limit}`);
            setTrendingTracks(data);
        } catch (error) {
            console.error("H-MIZIK TRENDING ERROR:", error);
        }
    };

    // 5. SEARCH MIZIK
    const searchTracks = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.get(`/search?q=${query}`);
            setSearchResults(data.tracks || []); 
        } catch (error) {
            console.error("H-MIZIK SEARCH ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    // 6. MOUTE KANTITE PLAYS (AK LOG KONPLÈ POU DEBUG)
    const incrementPlay = async (trackId: string) => {
        if (!trackId) {
            console.warn("H-MIZIK DEBUG: trackId pa defini!");
            return;
        }

        console.log(`%c H-MIZIK DEBUG: Tantativ Play pou ID: ${trackId} `, 'background: #222; color: #bada55');

        try {
            // Rele Back-end la (Asire w se POST epi URL la kòrèk)
            const response = await api.post(`/tracks/${trackId}/play`);
            
            console.log("H-MIZIK DEBUG: Repons Sèvè:", response.status, response.data);

            // Si sèvè a reponn byen, nou update UI a
            const updatePlayCount = (list: Track[]) => 
                list.map(t => t.id === trackId ? { ...t, playCount: (t.playCount || 0) + 1 } : t);

            setTracks(prev => updatePlayCount(prev));
            setTrendingTracks(prev => updatePlayCount(prev));
            setSearchResults(prev => updatePlayCount(prev));
            
        } catch (error: any) {
            console.error("%c H-MIZIK ERROR: incrementPlay echwe! ", 'background: #ff0000; color: #ffffff');
            
            if (error.response) {
                // Sèvè a reponn ak erè (ex: 404, 500, 401)
                console.error("Detay Erè (Server):", error.response.data);
                console.error("Status kòd:", error.response.status);
                
                if (error.response.status === 404) {
                    toast.error("Endpoint '/play' la pa egziste nan Back-end lan.");
                }
            } else if (error.request) {
                // Request pati men sèvè a pa reponn
                console.error("Erè Rezo (Network Error): Sèvè a pa reponn.");
                toast.error("Pwoblèm koneksyon ak sèvè a.");
            } else {
                console.error("Erè Konfigirasyon:", error.message);
            }
        }
    };

    useEffect(() => {
        fetchTracks(1);
        fetchTrending(6); 
    }, []);

    return (
        <TrackContext.Provider value={{
            uploading,
            loading,
            tracks,
            trendingTracks,
            searchResults,
            hasMore,
            uploadTrack,
            fetchTracks,
            fetchUserTracks,
            fetchTrending,
            searchTracks,
            incrementPlay
        }}>
            {children}
        </TrackContext.Provider>
    );
};

export const useTracks = () => {
    const context = useContext(TrackContext);
    if (!context) throw new Error("useTracks dwe itilize anndan TrackProvider");
    return context;
};