import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, } from 'lucide-react';
import api from '../../../api/axios';
import DiscoveryCard from './Discoverycard';

const DiscoveryWeekly: React.FC = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscovery = async () => {
            try {
                setLoading(true);
                // Nou rele endpoint NestJS nou te kreye a
                const { data } = await api.get('/recommendation/discovery');
                setTracks(data);
                console.log(data)
            } catch (err) {
                console.error("Erè Discovery:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscovery();
    }, []);

    if (loading) return <div className="p-6 text-zinc-500 italic">N ap prepare dekouvrit ou yo...</div>;
    if (tracks.length === 0) return null;

    return (
        <section className="mt-8 ">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-orange-500 rounded-lg shadow-lg">
                    <Sparkles className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                        Discovery <span className="text-orange-500 font-normal">Weekly</span>
                    </h2>
                    <p className="text-zinc-400 text-sm">Mizik nou panse w ap renmen, men ou poko tande.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {tracks.map((track: any, index: number) => (
                    <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <DiscoveryCard
                            track={track}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default DiscoveryWeekly;