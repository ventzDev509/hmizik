import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios'; // Enpòte instance axios ou te kreye ak interceptor a

// 1. Defini fòm done n ap manipile yo
interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    setUser: any | null;
    loading: boolean;
    authenticated: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    magicLink: (email: string) => Promise<void>;
    loginWithGoogle: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 2. Tcheke otomatikman si user a konekte (Check Auth)
    // Grasi ak Axios Interceptor, nou pa bezwen voye Token nan Header isit la ankò
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('h_mizik_token');
            if (token) {
                try {
                    // Nou itilize 'api' olye de 'axios'
                    const { data } = await api.get('/users/me');
                    setUser(data);
                } catch (err) {
                    // Interceptor a deja jere 401, men nou mete sa pou sekirite
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // 3. FONKSYON LOGIN KLASIK
    const login = async (credentials: any) => {

        try {
            const { data } = await api.post('/users/login', credentials);

            const { token, user } = data;

            if (token) {
                localStorage.setItem('h_mizik_token', token);
                setUser(user);
                toast.success('Byenvini ankò!');
            } else {
                console.error("Token pa jwenn nan repons lan!");
            }
            setUser(data.user);
            toast.success('Byenvini ankò!');
        } catch (error: any) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Email oswa modpas pa bon');
            throw error;
        }
    };

    // 4. FONKSYON REGISTER KLASIK
    const register = async (formData: any) => {
        try {
            const { data } = await api.post('/users/register', formData);
            toast.success(data.message || 'Kont lan kreye! Tcheke imèl ou.');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erè nan enskripsyon');
            throw error;
        }
    };

    // 5. FONKSYON MAGIC LINK
    const magicLink = async (email: string) => {
        try {
            await api.post('/users/magic-register', { email });
            toast.success('Yon lyen koneksyon voye nan imèl ou!', { icon: '📩' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erè nan voye imèl la');
            throw error;
        }
    };

    // 6. FONKSYON GOOGLE (Redireksyon dirèk)
    const loginWithGoogle = () => {
        // Nou itilize baseURL la si nou bezwen l, oswa nou ekri l an dirèk
        window.location.href = 'http://localhost:3000/users/google';
    };

    // 7. FONKSYON LOGOUT
    const logout = () => {
        localStorage.removeItem('h_mizik_token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            authenticated: !!user,
            login,
            register,
            magicLink,
            loginWithGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth dwe itilize anndan yon AuthProvider');
    return context;
};