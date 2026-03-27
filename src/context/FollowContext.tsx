import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

interface FollowContextType {
    followingIds: Set<string>; // Nou itilize Set pou pèfòmans (chèche rapid)
    toggleFollow: (artistId: string) => Promise<void>;
    isFollowing: (artistId: string) => boolean;
    loadingIds: string[]; // Pou konnen kilès k ap chaje
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Nou garde lis ID atis itilizatè a ap swiv yo
    const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    // Tcheke si w ap swiv yon atis
    const isFollowing = useCallback((artistId: string) => {
        return followingIds.has(artistId);
    }, [followingIds]);

    const toggleFollow = async (artistId: string) => {
        // 1. Mete l nan loading
        setLoadingIds(prev => [...prev, artistId]);

        // 2. Optimistic Update: Chanje UI a anvan nou rele API a
        const wasFollowing = followingIds.has(artistId);
        setFollowingIds(prev => {
            const newSet = new Set(prev);
            if (wasFollowing) newSet.delete(artistId);
            else newSet.add(artistId);
            return newSet;
        });

        try {
            const response = await api.post(`/follow/${artistId}`);
            const serverStatus = response.data.isFollowing;

            // 3. Senkronize ak sèvè a (si janm gen yon erè oswa lag)
            setFollowingIds(prev => {
                const newSet = new Set(prev);
                if (serverStatus) newSet.add(artistId);
                else newSet.delete(artistId);
                return newSet;
            });
        } catch (error) {
            // 4. Rollback: Si API a echwe, nou remete jan sa te ye a
            console.error("Erè nan toggle follow:", error);
            setFollowingIds(prev => {
                const newSet = new Set(prev);
                if (wasFollowing) newSet.add(artistId);
                else newSet.delete(artistId);
                return newSet;
            });
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== artistId));
        }
    };

    return (
        <FollowContext.Provider value={{ followingIds, toggleFollow, isFollowing, loadingIds }}>
            {children}
        </FollowContext.Provider>
    );
};

// Custom hook pou itilize l fasil
export const useFollow = () => {
    const context = useContext(FollowContext);
    if (!context) throw new Error("useFollow dwe itilize anndan yon FollowProvider");
    return context;
};