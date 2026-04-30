import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import api from '../../../api/axios';
import DiscoveryCard from './Discoverycard';

const DiscoveryWeekly: React.FC = () => {
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(5); 

    useEffect(() => {
        const fetchDiscovery = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/recommendation/discovery');
                setTracks(data);
            } catch (err) {
                console.error("Erè Discovery:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscovery();
    }, []);

    const handleShowMore = () => {
        setVisibleCount(prev => prev + 5); // Ajoute 5 chak fwa
    };

    if (loading) return <div className="p-6 text-zinc-500 italic animate-pulse">N ap prepare lis ou a...</div>;
    if (tracks.length === 0) return null;

    return (
        <section className="mt-8  max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                    <Sparkles className="text-white" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
                        Discovery <span className="text-orange-500 font-normal">Weekly</span>
                    </h2>
                    <p className="text-zinc-400 text-xs">Mizik fre ki baze sou gou w.</p>
                </div>
            </div>

            {/* Lis Mizik yo */}
            <div className="flex flex-col gap-1">
                <AnimatePresence>
                    {tracks.slice(0, visibleCount).map((track: any, index: number) => (
                        <motion.div
                            key={track.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <DiscoveryCard track={track} suggestions={tracks} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Bouton Afiche Plis */}
            {visibleCount < tracks.length && (
                <button
                    onClick={handleShowMore}
                    className="mt-6 flex items-center gap-2 mx-auto px-6 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-full text-xs font-bold transition-all border border-white/5"
                >
                    AFICHE PLIS
                    <ChevronDown size={14} />
                </button>
            )}
        </section>
    );
};

export default DiscoveryWeekly;