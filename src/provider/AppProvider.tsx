import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OfflineMusic from '../components/Mobile/OfflineMusic/OfflineMusic';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    // Nou kòmanse ak 'true' pa default pou evite "flash" offline a
    const [isOnline, setIsOnline] = useState(true); 
    const location = useLocation();

    useEffect(() => {
        // Nou mete valè reyèl la apre konponan an fin "mount"
        setIsOnline(navigator.onLine);

        const goOnline = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);

        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);

        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    // SI LI ONLINE, NOU PA JANM MONTRE PAJ OFFLINE LAN
    if (!isOnline && location.pathname !== '/telechaje') {
        return <OfflineMusic isRedirected={true} />;
    }

    return <>{children}</>;
};
export default AppProvider;