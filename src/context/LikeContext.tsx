import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios'; // Enpòte axios instans ou a
import toast from 'react-hot-toast';

interface LikeContextType {
    likedTrackIds: string[];
    loading: boolean;
    toggleLike: (trackId: string) => Promise<void>;
    isLiked: (trackId: string) => boolean;
    refreshLikes: () => Promise<void>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Rale tout ID mizik itilizatè a like
    const fetchLikes = async () => {
        if (!user) {
            setLikedTrackIds([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data } = await api.get('/likes');
            const ids = data.map((track: any) => track.id);
            setLikedTrackIds(ids);
        } catch (error) {
            console.error("Erè chaje favoris:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLikes();
    }, [user]);

    // 2. Fonksyon Toggle (Like/Unlike)
    const toggleLike = async (trackId: string) => {
         
        if (!user) {
            toast.error("Ou dwe konekte pou w like yon mizik");
            return;
        }

       
        // --- OPTIMISTIC UI UPDATE ---
        // Nou chanje eta a imedyatman pou itilizatè a pa tann
        const wasLiked = likedTrackIds.includes(trackId);
        
        if (wasLiked) {
            setLikedTrackIds(prev => prev.filter(id => id !== trackId));
        } else {
            setLikedTrackIds(prev => [...prev, trackId]);
        }

        try {
            // Rele endpoint POST /likes/:trackId nou te fè nan NestJS la
            await api.post(`/likes/${trackId}`);
            
            // Pa bezwen toast si sa mache, se yon aksyon ki fèt souvan
        } catch (error) {
            console.error("Erè toggle like:", error);
            toast.error("Echèk nan koneksyon ak sèvè a");
            
            // ROLLBACK: Si gen erè, nou remete eta a jan l te ye
            if (wasLiked) {
                setLikedTrackIds(prev => [...prev, trackId]);
            } else {
                setLikedTrackIds(prev => prev.filter(id => id !== trackId));
            }
        }
    };

    // 3. Helper pou konnen si yon track like (itil anpil nan kòman kòd la ekri)
    const isLiked = (trackId: string) => likedTrackIds.includes(trackId);

    return (
        <LikeContext.Provider value={{ 
            likedTrackIds, 
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