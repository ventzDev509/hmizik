import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OfflineMusic from '../components/Mobile/OfflineMusic/OfflineMusic';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    
    const [isOnline, setIsOnline] = useState(true); 
    const location = useLocation();

    useEffect(() => {
        
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

    
    if (!isOnline && location.pathname !== '/telechaje') {
        return <OfflineMusic isRedirected={true} />;
    }

    return <>{children}</>;
};
export default AppProvider;