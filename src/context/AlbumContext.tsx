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
    trackCount?: number; // Pou nou konnen konbe mizik ki ladan l san nou pa chaje tout tracks yo
    createdAt: string;
}

interface AlbumContextType {
    currentAlbum: Album | null;
    albums: Album[]; // <--- Te ajoute sa pou lis la
    isUploading: boolean;
    uploadProgress: number;
    error: string | null;
    loading: boolean; // <--- Pou loader lè n ap fetch
    
    // Fonksyon yo
    createAlbum: (formData: FormData) => Promise<void>;
    addTrack: (albumId: string, formData: FormData) => Promise<void>;
    finalizeAlbum: (albumId: string) => Promise<void>;
    getAlbum: (albumId: string) => Promise<void>;
    fetchUserAlbums: (userId: string) => Promise<void>; // <--- AJOUTE SA
    clearError: () => void;
    resetAlbumState: () => void;
}

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

export const AlbumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]); // Eta pou lis album yo
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);
    const resetAlbumState = () => {
        setCurrentAlbum(null);
        setError(null);
    };

    // 1. KREYE ALBUM (POST /album/create)
    const createAlbum = async (formData: FormData) => {
        setIsUploading(true);
        setError(null);
        try {
            const { data } = await api.post('/album/create', formData, {
                onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total!)),
            });
            setCurrentAlbum(data);
            // Nou ajoute l nan lis la tou otomatikman
            setAlbums(prev => [data, ...prev]);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erè nan kreyasyon album");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // 2. AJOUTE TRACK (POST /album/:id/add-track)
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

    // 3. FINALIZE (PATCH /album/:id/finalize)
    const finalizeAlbum = async (albumId: string) => {
        setIsUploading(true);
        setError(null);
        try {
            await api.patch(`/album/${albumId}/finalize`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Nou pa ka finalize album nan");
        } finally {
            setIsUploading(false);
        }
    };

    // 4. JWENN YON SÈL ALBUM (GET /album/:id)
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

    // 5. JWENN TOUT ALBUM YON ATIS (GET /album/user/:userId)
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
            createAlbum, addTrack, finalizeAlbum, getAlbum, fetchUserAlbums,
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