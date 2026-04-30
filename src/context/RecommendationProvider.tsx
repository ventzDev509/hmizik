import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; // Sèvi ak instance api ou a ki gen base URL la
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

    // 2. FETCH RECOMMENDATIONS
    const fetchRecommendations = useCallback(async () => {
        // Nou ka rekòmande menmsi itilizatè a pa konekte (Guest mode), 
        // if (!user) return;

        try {
            setLoading(true);

            // Rekipere dènye track ID a nan localStorage
            const lastTrackId = localStorage.getItem("lastTrackId") || "e7f164ec-0ab5-4637-8dcd-25f307a64b92";

            // Rele Backend NestJS la ki pral kontakte Python AI a
            const { data } = await api.get(`/recommendation/suggest/${lastTrackId}`);

            setRecommendedTracks(data);
        } catch (err) {
            console.error("Pa kapab jwenn rekòmandasyon", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // 3. SEND FEEDBACK (AI Loop)
    // rating: 1 (like/play), -1 (skip/dislike)
    const sendFeedback = async (trackId: string, rating: number) => {
        try {
            if (!user) return; // Feedback mache sèlman pou moun ki konekte

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

    // Chaje rekòmandasyon yo otomatikman lè Provider a moute oswa lè itilizatè a chanje
    useEffect(() => {
        fetchRecommendations();
        const r = api.post(`/recommendation/train`)
        console.log(r)
    }, [fetchRecommendations]);
    useEffect(() => {
        const trainAI = async () => {
            try {
                const response = await api.post(`/recommendation/train`);
                console.log("AI Training Result:", response.data);
            } catch (err) {
                console.error("Training Error:", err);
            }
        };

        trainAI();
    }, []); // [] asire l kouri yon sèl fwa nan montaj la
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

// Hook pèsonalize pou itilize nan konpozan yo
export const useRecommendation = () => {
    const context = useContext(RecommendationContext);
    if (!context) {
        throw new Error('useRecommendation dwe itilize anndan yon RecommendationProvider');
    }
    return context;
};