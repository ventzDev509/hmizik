import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';


interface Track {
    id: string;
    title: string;
    duration: number;
    audioUrl: string;
    coverUrl: string;
    playCount: number; 
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
    
    totalLikesCount: number;
    user: {
        name: string;
        username?: string; 
    };
    _count?: {
        tracks: number;
    };
}
interface PlaylistContextType {
    playlists: Playlist[]; 
    trendingPlaylists: Playlist[]; 
    loading: boolean;
    refreshPlaylists: () => Promise<void>;
    getTrendingPlaylists: () => Promise<void>; 
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

    
    const getTrendingPlaylists = async () => {
        try {
            const { data } = await api.get('/playlists/trending');
            setTrendingPlaylists(data);
        } catch (error) {
            console.error("Erè trending playlists:", error);
        }
    };

    
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
            
            await api.post(`/playlists/${playlistId}/tracks/${trackId}`);

            
            

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

    
    const incrementTrackPlay = async (trackId: string) => {
        try {
            await api.post(`/tracks/${trackId}/play`);
            
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