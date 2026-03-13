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
    tracks: Track[]; // Sèvi ak interface Track nou an
    _count?: {
        tracks: number;
    };
}

interface PlaylistContextType {
    playlists: Playlist[];
    loading: boolean;
    refreshPlaylists: () => Promise<void>;
    createPlaylist: (data: { name: string; description?: string, coverUrl?: string }) => Promise<boolean>;
    addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
    removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
    deletePlaylist: (id: string) => Promise<boolean>;
    updatePlaylist: (id: string, name: string) => Promise<boolean>;
    incrementTrackPlay: (trackId: string) => Promise<void>; // Fonksyon Solid la
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    // FETCH PLAYLISTS
    const fetchPlaylists = useCallback(async () => {
        if (!user) {
            setPlaylists([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data } = await api.get('/playlists/me');
            setPlaylists(data);
        } catch (error) {
            console.error("Erè nan chaje playlists:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPlaylists();
    }, [fetchPlaylists]);

    // CREATE PLAYLIST
    const createPlaylist = async (createData: { name: string; description?: string, coverUrl?: string }): Promise<boolean> => {
        try {
            const { data } = await api.post('/playlists', createData);
            setPlaylists((prev) => [data, ...prev]);
            toast.success("Playlist kreye ak siksè!");
            return true;
        } catch (error) {
            toast.error("Echèk nan kreyasyon playlist la");
            return false;
        }
    };

    // DELETE PLAYLIST
    const deletePlaylist = async (id: string) => {
        try {
            await api.delete(`/playlists/${id}`);
            setPlaylists((prev) => prev.filter(p => p.id !== id));
            toast.success("Playlist la efase");
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erè nan sipresyon");
            return false;
        }
    };

    // UPDATE PLAYLIST (CHANGE NAME)
    const updatePlaylist = async (id: string, name: string) => {
        try {
            const { data } = await api.patch(`/playlists/${id}`, { name });
            setPlaylists((prev) =>
                prev.map(p => p.id === id ? { ...p, name: data.name } : p)
            );
            toast.success("Non an chanje!");
            return true;
        } catch (error) {
            toast.error("Echèk nan chanje non an");
            return false;
        }
    };

    // ADD TRACK TO PLAYLIST
    const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
        try {
            await api.post(`/playlists/${playlistId}/tracks`, { trackId });
            await fetchPlaylists(); // Rafrechi pou wè nouvo track la ak kontè yo
            toast.success("Mizik la ajoute!");
            return true;
        } catch (error) {
            toast.error("Mizik la deja la oswa gen yon erè");
            return false;
        }
    };

    // REMOVE TRACK FROM PLAYLIST
    const removeTrackFromPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
        try {
            await api.delete(`/playlists/${playlistId}/tracks/${trackId}`);
            setPlaylists((prev) =>
                prev.map(p => p.id === playlistId ? { 
                    ...p, 
                    tracks: p.tracks.filter(t => t.id !== trackId) 
                } : p)
            );
            toast.success("Mizik la retire!");
            return true;
        } catch (error) {
            toast.error("Echèk nan retire mizik la");
            return false;
        }
    };

    // NOUVO: INCREMENT TRACK PLAY (SOLID)
    // Fonksyon sa ap ogmante playCount la nan Back-end epi ajou UI tout playlist yo
    const incrementTrackPlay = async (trackId: string) => {
        try {
            // Rele Back-end la (li gen cooldown ak IP check deja)
            await api.post(`/tracks/${trackId}/play`);

            // Mizajou lokal nan tout playlists yo pou UI a toujou "sync"
            setPlaylists((prev) =>
                prev.map((playlist) => ({
                    ...playlist,
                    tracks: playlist.tracks?.map((t) =>
                        t.id === trackId 
                            ? { ...t, playCount: (t.playCount || 0) + 1 } 
                            : t
                    ),
                }))
            );
        } catch (error) {
            console.error("Erè increment play:", error);
        }
    };

    return (
        <PlaylistContext.Provider
            value={{
                playlists,
                loading,
                deletePlaylist,
                updatePlaylist,
                refreshPlaylists: fetchPlaylists,
                createPlaylist,
                addTrackToPlaylist,
                removeTrackFromPlaylist,
                incrementTrackPlay // Esansyèl pou Solid Playback
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