import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; 
import { useAuth } from './AuthContext';

interface RecommendedTrack {
    id: string;
    title: string;
    genre: string;
    duration: number;
    bpm: number;
    playCount: number;
    audioUrl: string;
    coverUrl: string;
    artist?: {
        username: string;
        user: { name: string };
    };
}

interface RecommendationContextType {
    recommendedTracks: RecommendedTrack[];
    loading: boolean;
    fetchRecommendations: () => Promise<void>;
    sendFeedback: (trackId: string, rating: number) => Promise<void>;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [recommendedTracks, setRecommendedTracks] = useState<RecommendedTrack[]>([]);
    const [loading, setLoading] = useState(false);

    
    const fetchRecommendations = useCallback(async () => {
        
        

        try {
            setLoading(true);

            
            const lastTrackId = localStorage.getItem("lastTrackId") || "e7f164ec-0ab5-4637-8dcd-25f307a64b92";

            
            const { data } = await api.get(`/recommendation/suggest/${lastTrackId}`);

            setRecommendedTracks(data);
        } catch (err) {
            console.error("Pa kapab jwenn rekòmandasyon", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    
    
    const sendFeedback = async (trackId: string, rating: number) => {
        try {
            if (!user) return; 

            await api.post('/recommendation/feedback', {
                userId: user.id,
                trackId: trackId,
                rating: rating
            });

            console.log(`Feedback ${rating} voye pou ${trackId}`);
        } catch (err) {
            console.error("Erè nan voye feedback:", err);
        }
    };

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    return (
        <RecommendationContext.Provider
            value={{
                recommendedTracks,
                loading,
                fetchRecommendations,
                sendFeedback
            }}
        >
            {children}
        </RecommendationContext.Provider>
    );
};


export const useRecommendation = () => {
    const context = useContext(RecommendationContext);
    if (!context) {
        throw new Error('useRecommendation dwe itilize anndan yon RecommendationProvider');
    }
    return context;
};