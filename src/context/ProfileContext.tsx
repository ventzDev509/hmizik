import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface ProfileData {
    id: string;
    userId: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    bannerUrl: string | null;
    location: string | null;
    isArtist: boolean;
    verified: boolean;
    socialLinks:
    {
        instagram: string;
        youtube: string;
        tiktok: string;
        facebook: string;
    }
    ;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}


interface PaginatedProfiles {
    data: ProfileData[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

interface ProfileContextType {
    profile: ProfileData | null;
    loading: boolean;
    
    allProfiles: ProfileData[];
    profilesMeta: PaginatedProfiles['meta'] | null;
    fetchAllProfiles: (page?: number, limit?: number) => Promise<void>;
    
    refreshProfile: () => Promise<void>;
    updateProfile: (data: any | FormData) => Promise<boolean>;
    becomeArtist: (data: { stageName: string; bio?: string; location?: string; socialLinks?: any }) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    
    const [allProfiles, setAllProfiles] = useState<ProfileData[]>([]);
    const [profilesMeta, setProfilesMeta] = useState<PaginatedProfiles['meta'] | null>(null);

    const fetchProfile = async () => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data } = await api.get('/profiles/me');
            setProfile(data);
        } catch (error) {
            console.error("Erè chaje pwofil mwen:", error);
        } finally {
            setLoading(false);
        }
    };

    
    const fetchAllProfiles = async (page = 1, limit = 10) => {
        try {
            const { data } = await api.get<PaginatedProfiles>(`/profiles`, {
                params: { page, limit }
            });

            
            setAllProfiles(prev => (page === 1 ? data.data : [...prev, ...data.data]));

            setProfilesMeta(data.meta);
        } catch (error) {
            console.error("Erè chaje lis pwofil yo:", error);
            toast.error("Impossible chaje lis atis yo");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const updateProfile = async (updateData: any): Promise<boolean> => {
        try {
            const { data } = await api.patch('/profiles/update', updateData);
            setProfile(data);
            toast.success("Pwofil mizajou!");
            return true;
        } catch (error) {
            console.error("Erè nan update:", error);
            toast.error("Echèk nan mizajou pwofil la");
            return false;
        }
    };


    const becomeArtist = async (artistData: {
        stageName: string;
        bio?: string;
        location?: string;
        socialLinks?: any
    }): Promise<boolean> => {
        try {
            setLoading(true);
            
            const { data } = await api.post('/profiles/become-artist', artistData);

            
            setProfile(data);

            toast.success("Felisitasyon! Ou se yon atis ofisyèl kounye a.");
            return true;
        } catch (error: any) {
            console.error("Erè lè w ap vin atis:", error);
            const message = error.response?.data?.message || "Echèk nan kreyasyon pwofil atis la";
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };
    return (
        <ProfileContext.Provider
            value={{
                profile,
                loading,
                allProfiles,
                profilesMeta,
                fetchAllProfiles,
                refreshProfile: fetchProfile,
                updateProfile,
                becomeArtist
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error('useProfile dwe itilize anndan yon ProfileProvider');
    return context;
};