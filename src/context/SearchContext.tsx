import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';


interface SearchResults {
    tracks: any[];
    artists: any[];
    albums: any[];
    playlists: any[];
}

interface SearchContextType {
    query: string;
    results: SearchResults;
    loading: boolean;
    error: string | null;
    recentSearches: string[];
    
    
    searchGlobal: (q: string) => Promise<void>;
    setQuery: (q: string) => void;
    clearSearch: () => void;
    addRecentSearch: (term: string) => void;
    removeRecentSearch: (term: string) => void;
    clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [query, setQueryState] = useState('');
    const [results, setResults] = useState<SearchResults>({
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        const saved = localStorage.getItem('h_mizik_recent_searches');
        return saved ? JSON.parse(saved) : [];
    });

    
    const searchGlobal = useCallback(async (q: string) => {
        if (!q.trim() || q.length < 2) {
            setResults({ tracks: [], artists: [], albums: [], playlists: [] });
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/search?q=${q}`);
            setResults({
                tracks: data.tracks || [],
                artists: data.artists || [],
                albums: data.albums || [],
                playlists: data.playlists || []
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Erè nan rechèch la");
        } finally {
            setLoading(false);
        }
    }, []);

    const setQuery = (q: string) => {
        setQueryState(q);
    };

    const clearSearch = () => {
        setQueryState('');
        setResults({ tracks: [], artists: [], albums: [], playlists: [] });
        setError(null);
    };

    
    const addRecentSearch = (term: string) => {
        if (!term.trim()) return;
        setRecentSearches(prev => {
            const filtered = prev.filter(t => t !== term); 
            const updated = [term, ...filtered].slice(0, 10); 
            localStorage.setItem('h_mizik_recent_searches', JSON.stringify(updated));
            return updated;
        });
    };

    const removeRecentSearch = (term: string) => {
        setRecentSearches(prev => {
            const updated = prev.filter(t => t !== term);
            localStorage.setItem('h_mizik_recent_searches', JSON.stringify(updated));
            return updated;
        });
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('h_mizik_recent_searches');
    };

    return (
        <SearchContext.Provider value={{
            query,
            results,
            loading,
            error,
            recentSearches,
            searchGlobal,
            setQuery,
            clearSearch,
            addRecentSearch,
            removeRecentSearch,
            clearRecentSearches
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error('useSearch dwe itilize anndan yon SearchProvider');
    return context;
};