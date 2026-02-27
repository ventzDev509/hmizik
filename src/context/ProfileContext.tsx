import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface ProfileData {
    id: string;
    username: string | null;
    bio: string | null;
    socialLinks: string[] | null;
    avatarUrl: string | null;
    bannerUrl: string | null;
    user: {
        name: string;
        email: string;
    };
}

interface ProfileContextType {
    profile: ProfileData | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    updateProfile: (data: any | FormData) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth(); // Nou bezwen Auth pou n konnen si moun lan konekte
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        if (!user) return;
        try {
            setLoading(true);
            // Rele endpoint GET /profiles/me nou te kreye nan NestJS la
            const { data } = await api.get('/profiles/me');
            setProfile(data);
        } catch (error) {
            console.error("Erè chaje pwofil:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const updateProfile = async (updateData: any): Promise<boolean> => { // Ajoute : Promise<boolean>
        try {
            const { data } = await api.patch('/profiles/update', updateData);
            setProfile(data); // Mizajou lokal apre siksè
            return true;
        } catch (error) {
            console.error("Erè nan update:", error);
            toast.error("Echèk nan mizajou pwofil la");

            // TRÈ ENPÒTAN: Retounen false si gen erè
            return false;
            // throw error;

        }
    };

    return (
        <ProfileContext.Provider value={{ profile, loading, refreshProfile: fetchProfile, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error('useProfile dwe itilize anndan yon ProfileProvider');
    return context;
};