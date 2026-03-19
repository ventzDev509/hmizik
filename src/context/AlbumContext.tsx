import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

interface Track {
    id: string;
    title: string;
    audioUrl: string;
    duration?: number;
    coverUrl?: string;
}

interface Album {
    id: string;
    title: string;
    coverUrl: string;
    releaseDate: string;
    genre?: string;
    description?: string;
    tracks: Track[];
    artist?: {
        id: string;
        username: string;
    };
    trackCount?: number;
    createdAt: string;
}

interface AlbumContextType {
    currentAlbum: Album | null;
    albums: Album[];
    isUploading: boolean;
    uploadProgress: number;
    error: string | null;
    loading: boolean;

    // Fonksyon ki te la deja
    createAlbum: (formData: FormData) => Promise<void>;
    addTrack: (albumId: string, formData: FormData) => Promise<void>;
    getAlbum: (albumId: string) => Promise<void>;
    getAlbums: () => Promise<void>;
    fetchUserAlbums: (userId: string) => Promise<void>;
    
    // NOUVO FONKSYON POU ADAPTE AK BACKEND NAN
    updateAlbum: (albumId: string, formData: FormData) => Promise<void>; // Pou tit ak cover
    deleteTrack: (trackId: string) => Promise<void>;
    finalizeAlbum: (albumId: string) => Promise<void>;
    
    clearError: () => void;
    resetAlbumState: () => void;
}

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

export const AlbumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);
    const resetAlbumState = () => {
        setCurrentAlbum(null);
        setError(null);
    };

    // 1. KREYE ALBUM
    const createAlbum = async (formData: FormData) => {
        setIsUploading(true);
        setError(null);
        try {
            const { data } = await api.post('/album/create', formData, {
                onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total!)),
            });
            setCurrentAlbum(data);
            setAlbums(prev => [data, ...prev]);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erè nan kreyasyon album");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // 2. MODIFYE ALBUM (TIT OSWA COVER)
    const updateAlbum = async (albumId: string, formData: FormData) => {
        setIsUploading(true);
        setError(null);
        try {
            const { data } = await api.patch(`/album/${albumId}`, formData, {
                onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total!)),
            });
            // Nou mete ajou album nan state la
            setCurrentAlbum(data);
            setAlbums(prev => prev.map(a => a.id === albumId ? data : a));
        } catch (err: any) {
            setError(err.response?.data?.message || "Erè nan modifikasyon album");
            throw err;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // 3. EFASE YON MIZIK NAN ALBUM LAN
    const deleteTrack = async (trackId: string) => {
        setError(null);
        try {
            await api.delete(`/album/tracks/${trackId}`);
            // Nou retire track la nan UI a otomatikman
            if (currentAlbum) {
                setCurrentAlbum({
                    ...currentAlbum,
                    tracks: currentAlbum.tracks.filter(t => t.id !== trackId)
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Nou pa ka efase mizik sa a");
            throw err;
        }
    };

    // 4. AJOUTE TRACK
    const addTrack = async (albumId: string, formData: FormData) => {
        setIsUploading(true);
        setError(null);
        try {
            const { data } = await api.post(`/album/${albumId}/add-track`, formData, {
                onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total!)),
            });
            if (currentAlbum) {
                setCurrentAlbum({ ...currentAlbum, tracks: [...currentAlbum.tracks, data] });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Upload mizik la echwe");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // 5. FINALIZE ALBUM
    const finalizeAlbum = async (albumId: string) => {
        setIsUploading(true);
        setError(null);
        try {
            const { data } = await api.patch(`/album/${albumId}/finalize`);
            setCurrentAlbum(data); // Backend an voye album nan ak isPublished: true
        } catch (err: any) {
            setError(err.response?.data?.message || "Nou pa ka finalize album nan");
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    // 6. JWENN YON SÈL ALBUM
    const getAlbum = async (albumId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/album/${albumId}`);
            setCurrentAlbum(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Nou pa ka jwenn album sa a");
        } finally {
            setLoading(false);
        }
    };

    // 7. JWENN TOUT ALBUM YO
    const getAlbums = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/album`);
            setAlbums(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erè nan chaje album yo");
        } finally {
            setLoading(false);
        }
    };

    // 8. JWENN ALBUM YON ATIS
    const fetchUserAlbums = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/album/user/${userId}`);
            setAlbums(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erè nan chaje album yo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlbumContext.Provider value={{
            currentAlbum, albums, isUploading, uploadProgress, error, loading,
            createAlbum, updateAlbum, deleteTrack, addTrack, finalizeAlbum, 
            getAlbum, fetchUserAlbums, getAlbums,
            clearError, resetAlbumState
        }}>
            {children}
        </AlbumContext.Provider>
    );
};

export const useAlbum = () => {
    const context = useContext(AlbumContext);
    if (!context) throw new Error('useAlbum dwe itilize anndan yon AlbumProvider');
    return context;
};