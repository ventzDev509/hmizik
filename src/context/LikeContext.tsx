import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios'; 
import toast from 'react-hot-toast';

interface LikeContextType {
    likedTrackIds: string[];
    likedAlbumIds: string[];
    loading: boolean;
    toggleLike: (id: string, type?: 'track' | 'album') => Promise<void>;
    isLiked: (trackId: string, type?: 'track' | 'album') => boolean;
    refreshLikes: () => Promise<void>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);
    const [likedAlbumIds, setLikedAlbumIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchLikes = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/likes');

            
            const trackIds = data.tracks.map((t: any) => t.id);
            const albumIds = data.albums.map((a: any) => a.id);

            setLikedTrackIds(trackIds);
            setLikedAlbumIds(albumIds); 

        } catch (error) {
            console.error("Erè:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLikes();
    }, [user]);

    
    const toggleLike = async (id: string, type: 'track' | 'album' = 'track') => {

        if (!user) {
            toast.error(`Ou dwe konekte pou w like yon ${type === 'track' ? 'mizik' : 'album'}`);
            return;
        }

        
        
        
        const wasLiked = likedTrackIds.includes(id);

        
        if (wasLiked) {
            setLikedTrackIds(prev => prev.filter(item => item !== id));
        } else {
            setLikedTrackIds(prev => [...prev, id]);
        }

        try {

            await api.post(`/likes/${id}?type=${type}`);

        } catch (error) {
            toast.error("Echèk nan koneksyon");

            if (wasLiked) {
                setLikedTrackIds(prev => [...prev, id]);
            } else {
                setLikedTrackIds(prev => prev.filter(item => item !== id));
            }
        }
    };
    
    const isLiked = (id: string, type: 'track' | 'album' = 'track') => {
        if (type === 'track') {
            return likedTrackIds.includes(id);
        }
        return likedAlbumIds.includes(id); 
    };

    return (
        <LikeContext.Provider value={{
            likedTrackIds,
            likedAlbumIds,
            loading,
            toggleLike,
            isLiked,
            refreshLikes: fetchLikes
        }}>
            {children}
        </LikeContext.Provider>
    );
};

export const useLikes = () => {
    const context = useContext(LikeContext);
    if (!context) throw new Error('useLikes dwe itilize anndan yon LikeProvider');
    return context;
};