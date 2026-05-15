import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

interface FollowContextType {
    followingIds: Set<string>;
    followersCounts: Record<string, number>; 
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

    
    const updateFollowersCount = useCallback((artistId: string, count: number) => {
        setFollowersCounts(prev => ({ ...prev, [artistId]: count }));
    }, []);

    const toggleFollow = async (artistId: string) => {
        setLoadingIds(prev => [...prev, artistId]);

        const wasFollowing = followingIds.has(artistId);
        
        
        setFollowingIds(prev => {
            const newSet = new Set(prev);
            if (wasFollowing) newSet.delete(artistId);
            else newSet.add(artistId);
            return newSet;
        });

        
        setFollowersCounts(prev => ({
            ...prev,
            [artistId]: (prev[artistId] || 0) + (wasFollowing ? -1 : 1)
        }));

        try {
            const response = await api.post(`/follow/${artistId}`);
            
            
            if (response.data.newCount !== undefined) {
                updateFollowersCount(artistId, response.data.newCount);
            }
        } catch (error) {
            console.error("Erè nan toggle follow:", error);
            
            
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