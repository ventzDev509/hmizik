import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

interface FollowContextType {
    followingIds: Set<string>;
    followersCounts: Record<string, number>; // { artistId: count }
    toggleFollow: (artistId: string) => Promise<void>;
    isFollowing: (artistId: string) => boolean;
    updateFollowersCount: (artistId: string, count: number) => void;
    loadingIds: string[];
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
    const [followersCounts, setFollowersCounts] = useState<Record<string, number>>({});
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const isFollowing = useCallback((artistId: string) => {
        return followingIds.has(artistId);
    }, [followingIds]);

    // Fonksyon pou mete chif la ajou manyèlman si n sot fè yon fetch
    const updateFollowersCount = useCallback((artistId: string, count: number) => {
        setFollowersCounts(prev => ({ ...prev, [artistId]: count }));
    }, []);

    const toggleFollow = async (artistId: string) => {
        setLoadingIds(prev => [...prev, artistId]);

        const wasFollowing = followingIds.has(artistId);
        
        // 1. Optimistic Update (Toggling ID)
        setFollowingIds(prev => {
            const newSet = new Set(prev);
            if (wasFollowing) newSet.delete(artistId);
            else newSet.add(artistId);
            return newSet;
        });

        // 2. Optimistic Update (Chanje chif la imedyatman nan UI a)
        setFollowersCounts(prev => ({
            ...prev,
            [artistId]: (prev[artistId] || 0) + (wasFollowing ? -1 : 1)
        }));

        try {
            const response = await api.post(`/follow/${artistId}`);
            // Nou ka pwofite mande backend lan voye nouvo count lan tou nan response la
            // Si backend la voye l, nou senkronize l
            if (response.data.newCount !== undefined) {
                updateFollowersCount(artistId, response.data.newCount);
            }
        } catch (error) {
            console.error("Erè nan toggle follow:", error);
            
            // Rollback si sa echwe
            setFollowingIds(prev => {
                const newSet = new Set(prev);
                if (wasFollowing) newSet.add(artistId);
                else newSet.delete(artistId);
                return newSet;
            });

            setFollowersCounts(prev => ({
                ...prev,
                [artistId]: (prev[artistId] || 0) + (wasFollowing ? 1 : -1)
            }));
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== artistId));
        }
    };

    return (
        <FollowContext.Provider value={{ 
            followingIds, 
            followersCounts, 
            toggleFollow, 
            isFollowing, 
            updateFollowersCount,
            loadingIds 
        }}>
            {children}
        </FollowContext.Provider>
    );
};

export const useFollow = () => {
    const context = useContext(FollowContext);
    if (!context) throw new Error("useFollow dwe itilize anndan yon FollowProvider");
    return context;
};