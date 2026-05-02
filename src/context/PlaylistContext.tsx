import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

// 1. Defini estrikti Track anndan yon Playlist
interface Track {
    id: string;
    title: string;
    duration: number;
    audioUrl: string;
    coverUrl: string;
    playCount: number; // Solid: nou sèvi ak playCount olye de plays
    artist: {
        username: string;
        user: { name: string };
    };
}

interface Playlist {
    id: string;
    name: string;
    description: string | null;
    coverUrl: string | null;
    isPublic: boolean;
    userId: string;
    createdAt: string;
    tracks: Track[];
    // Ajoute de sa yo pou yo matche ak sa Card la bezwen:
    totalLikesCount: number;
    user: {
        name: string;
        username?: string; // Opsyonèl si w bezwen l pi devan
    };
    _count?: {
        tracks: number;
    };
}
interface PlaylistContextType {
    playlists: Playlist[]; // Playlist itilizatè a
    trendingPlaylists: Playlist[]; // Playlist ki nan akèy la (nouvo)
    loading: boolean;
    refreshPlaylists: () => Promise<void>;
    getTrendingPlaylists: () => Promise<void>; // Pou paj akèy la
    getPlaylistById: (id: string) => Promise<Playlist | null>;
    createPlaylist: (data: { name: string; description?: string, coverUrl?: string }) => Promise<boolean>;
    addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
    removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
    deletePlaylist: (id: string) => Promise<boolean>;
    updatePlaylist: (id: string, data: { name?: string, description?: string, isPublic?: boolean }) => Promise<boolean>;
    incrementTrackPlay: (trackId: string) => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [trendingPlaylists, setTrendingPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. FETCH PERSONAL PLAYLISTS
    const fetchPlaylists = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data } = await api.get('/playlists/my-library');
            setPlaylists(data);
        } catch (error) {
            console.error("Erè playlists pèsonèl:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // 2. FETCH TRENDING (RANKING) - Pou paj Akèy
    const getTrendingPlaylists = async () => {
        try {
            const { data } = await api.get('/playlists/trending');
            setTrendingPlaylists(data);
        } catch (error) {
            console.error("Erè trending playlists:", error);
        }
    };

    // 3. FETCH SINGLE PLAYLIST (AK TOUT MIZIK LI YO)
    const getPlaylistById = async (id: string): Promise<Playlist | null> => {
        try {
            const { data } = await api.get(`/playlists/${id}`);
            return data;
        } catch (error) {
            toast.error("Nou pa ka jwenn playlist sa a");
            return null;
        }
    };

    useEffect(() => {
        fetchPlaylists();
        getTrendingPlaylists();
    }, [fetchPlaylists]);

    // 4. CREATE PLAYLIST
    const createPlaylist = async (createData: { name: string; description?: string, coverUrl?: string }): Promise<boolean> => {
        try {
            const { data } = await api.post('/playlists', createData);
            setPlaylists((prev) => [data, ...prev]);
            toast.success("Playlist kreye!");
            return true;
        } catch (error) {
            toast.error("Echèk kreyasyon");
            return false;
        }
    };

    // 5. UPDATE PLAYLIST (FULL VERSION)
    const updatePlaylist = async (id: string, updateData: { name?: string, description?: string, isPublic?: boolean }) => {
        try {
            const { data } = await api.patch(`/playlists/${id}`, updateData);
            setPlaylists((prev) =>
                prev.map(p => p.id === id ? { ...p, ...data } : p)
            );
            toast.success("Mizajou fèt!");
            return true;
        } catch (error) {
            toast.error("Echèk mizajou");
            return false;
        }
    };

    // 6. DELETE PLAYLIST
    const deletePlaylist = async (id: string) => {
        try {
            await api.delete(`/playlists/${id}`);
            setPlaylists((prev) => prev.filter(p => p.id !== id));
            toast.success("Playlist efase");
            return true;
        } catch (error) {
            toast.error("Erè nan sipresyon");
            return false;
        }
    };

    
    const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
        try {
            // Si API a mande trackId nan URL la (jan erè a montre l la):
            await api.post(`/playlists/${playlistId}/tracks/${trackId}`);

            // Si API a mande l nan BODY a, se ta: 
            // await api.post(`/playlists/${playlistId}/tracks`, { trackId });

            await fetchPlaylists();
            toast.success("Mizik la ajoute!");
            return true;
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error("Ou pa gen dwa modifye playlist sa a");
            } else {
                toast.error("Mizik la deja la oswa gen yon erè");
            }
            return false;
        }
    };
    // 8. REMOVE TRACK FROM PLAYLIST
    const removeTrackFromPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
        try {
            await api.delete(`/playlists/${playlistId}/tracks/${trackId}`);
            setPlaylists((prev) =>
                prev.map(p => p.id === playlistId ? {
                    ...p,
                    tracks: p.tracks?.filter(t => t.id !== trackId)
                } : p)
            );
            toast.success("Mizik retire!");
            return true;
        } catch (error) {
            toast.error("Echèk retire mizik la");
            return false;
        }
    };

    // 9. INCREMENT TRACK PLAY
    const incrementTrackPlay = async (trackId: string) => {
        try {
            await api.post(`/tracks/${trackId}/play`);
            // Mizajou UI local pou tout kote mizik la parèt
            const updateTracksInList = (list: Playlist[]) =>
                list.map(pl => ({
                    ...pl,
                    tracks: pl.tracks?.map(t => t.id === trackId ? { ...t, playCount: (t.playCount || 0) + 1 } : t)
                }));

            setPlaylists(prev => updateTracksInList(prev));
            setTrendingPlaylists(prev => updateTracksInList(prev));
        } catch (error) {
            console.error("Erè increment:", error);
        }
    };

    return (
        <PlaylistContext.Provider
            value={{
                playlists,
                trendingPlaylists,
                loading,
                refreshPlaylists: fetchPlaylists,
                getTrendingPlaylists,
                getPlaylistById,
                createPlaylist,
                addTrackToPlaylist,
                removeTrackFromPlaylist,
                deletePlaylist,
                updatePlaylist,
                incrementTrackPlay
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylists = () => {
    const context = useContext(PlaylistContext);
    if (!context) throw new Error('usePlaylists dwe itilize anndan yon PlaylistProvider');
    return context;
};