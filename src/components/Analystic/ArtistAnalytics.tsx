import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Headphones,
    Music,
    ArrowUpRight,
    BarChart3,
    Wallet,
    MapPin,
    Lightbulb,
    Banknote,
    Sparkles
} from 'lucide-react';
import type { Track } from '../types/Profile';

interface AnalyticsProps {
    tracks: Track[];
}

export const ArtistAnalytics = ({ tracks }: AnalyticsProps) => {
    const artistProfile = tracks[0]?.artist?.user?.profile;

    const TARIF_HTG = artistProfile?.customTarif ?? 0.20;
    const SEUIL_PEMAN = artistProfile?.payoutThreshold ?? 2500;
    
    const stats = useMemo(() => {
        const totalPlays = tracks.reduce((acc, track) => acc + (track.playCount || 0), 0);
        const totalEarningsHTG = totalPlays * TARIF_HTG;
        const progressPercent = Math.min(100, (totalEarningsHTG / SEUIL_PEMAN) * 100);

        return {
            totalPlays,
            totalEarningsHTG,
            trackCount: tracks.length,
            avgPlays: tracks.length > 0 ? Math.round(totalPlays / tracks.length) : 0,
            progressPercent,
            remainingHTG: Math.max(0, SEUIL_PEMAN - totalEarningsHTG)
        };
    }, [tracks]);

    
    const topTracks = useMemo(() => {
        return [...tracks]
            .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
            .slice(0, 5);
    }, [tracks]);

    const cityStats = useMemo(() => {
        const allPlays = tracks.flatMap(t => t.plays || []);
        if (allPlays.length === 0) return [];

        const counts = allPlays.reduce((acc: Record<string, number>, play: any) => {
            const cityName = play.city || "Lòt bò dlo";
            acc[cityName] = (acc[cityName] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .map(([v, count]) => ({
                v,
                count,
                p: Math.round((count / allPlays.length) * 100)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
    }, [tracks]);

    const topCityName = cityStats[0]?.v || "Haiti";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
        >
            {}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                    Statistik Atis
                </h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-left">
                        H-MIZIK Monetizasyon • Done an tan reyèl
                    </p>
                </div>
            </div>

            {}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={<Headphones className="text-orange-500" size={20} />}
                    label="Total Ekout"
                    value={stats.totalPlays.toLocaleString()}
                    color="bg-orange-600/10"
                />
                <StatCard
                    icon={<Wallet className="text-green-500" size={20} />}
                    label="Revni (HTG)"
                    value={`${stats.totalEarningsHTG.toLocaleString()} G`}
                    color="bg-green-500/10"
                />
                <StatCard
                    icon={<Music className="text-blue-500" size={20} />}
                    label="Mizik Upload"
                    value={stats.trackCount.toString()}
                    color="bg-blue-500/10"
                />
                <StatCard
                    icon={<TrendingUp className="text-purple-500" size={20} />}
                    label="Mwayèn/Mizik"
                    value={stats.avgPlays.toLocaleString()}
                    color="bg-purple-500/10"
                />
            </div>

            {}
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/[0.03] backdrop-blur-sm">
                <div className="flex justify-between items-end mb-5 text-left">
                    <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Objektif Peman</p>
                        <h4 className="text-lg font-black text-white italic uppercase mt-1">
                            {stats.progressPercent.toFixed(1)}% <span className="text-zinc-600 text-[10px] not-italic">nan papòt la</span>
                        </h4>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-500 uppercase">Rete</p>
                        <p className="text-xs font-black text-orange-500">{stats.remainingHTG.toLocaleString()} HTG</p>
                    </div>
                </div>
                <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progressPercent}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                    />
                </div>
                <p className="text-[9px] text-zinc-600 font-bold uppercase mt-4 text-center tracking-[0.2em]">
                    Limit retrè: 2,500 HTG
                </p>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {}
                <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/[0.03]">
                    <h3 className="text-sm font-black uppercase italic flex items-center gap-2 text-white mb-8">
                        <BarChart3 size={18} className="text-orange-500" />
                        Mizik ki pi popilè
                    </h3>
                    <div className="space-y-6">
                        {topTracks.length > 0 ? topTracks.map((track, index) => (
                            <div key={track.id} className="flex items-center gap-4 group">
                                <span className="text-[10px] font-black text-zinc-700 w-4">0{index + 1}</span>
                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-zinc-800">
                                    <img src={track.coverUrl || "/default-music.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-xs font-black uppercase truncate text-white">{track.title}</p>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{track.genre}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-white">{track.playCount?.toLocaleString() || 0}</p>
                                    <p className="text-[10px] text-green-500 font-black">+{((track.playCount || 0) * TARIF_HTG).toLocaleString()} G</p>
                                </div>
                            </div>
                        )) : <p className="text-zinc-600 text-[10px] font-black uppercase py-10">Poko gen done</p>}
                    </div>
                </div>

                {}
                <div className="space-y-4">
                    <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/[0.03]">
                        <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-6 flex items-center gap-2 text-left">
                            <MapPin size={14} className="text-orange-500" />
                            Top Lokalizasyon
                        </h4>
                        <div className="space-y-4">
                            {cityStats.length > 0 ? cityStats.map((loc) => (
                                <div key={loc.v} className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-white uppercase w-24 truncate text-left">{loc.v}</span>
                                    <div className="flex-1 px-4">
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${loc.p}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-500 w-8 text-right">{loc.p}%</span>
                                </div>
                            )) : (
                                <p className="text-zinc-600 text-[10px] font-black uppercase py-4">Poko gen done lokalizasyon</p>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="bg-orange-600/5 rounded-[2.5rem] p-8 border border-orange-600/10 flex flex-col justify-center text-left">
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                            <Lightbulb size={20} className="text-black" />
                        </div>
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Konsèy pou ou</p>
                        <p className="text-xs font-bold text-zinc-300 mt-2 leading-relaxed italic">
                            Mizik ou yo ap domine nan zòn <span className="text-white underline decoration-orange-600">{topCityName}</span>.
                            Fè plis pwomosyon la pou w ka triple revni w!
                        </p>
                    </div>
                </div>
            </div>

            {}
           <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-[2.5rem] p-8 text-black relative overflow-hidden border border-white/20"
>
    {}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl" />
    
    <div className="relative z-10">
        {}
        <div className="flex items-center gap-2 mb-6">
            <div className="bg-black/10 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-black/5">
                <div className={`w-2 h-2 rounded-full animate-pulse ${stats.totalEarningsHTG >= SEUIL_PEMAN ? 'bg-green-600' : 'bg-black/40'}`} />
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Retrè MonCash</span>
            </div>
            
            {stats.totalEarningsHTG >= SEUIL_PEMAN && (
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="bg-white/30 backdrop-blur-md p-1.5 rounded-full"
                >
                    <Sparkles size={12} className="text-white" />
                </motion.div>
            )}
        </div>

        {}
        <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase italic leading-[0.9] tracking-tighter">
                Fè kòb ak <span className="text-white drop-shadow-sm">vwa ou</span>.
            </h3>
            <h3 className="text-xl font-black uppercase italic opacity-90">
                Resevwa HTG pa w la.
            </h3>
        </div>

        {}
        <div className="mt-6 space-y-4">
            <p className="text-[11px] font-bold leading-relaxed opacity-80 max-w-[260px]">
                {stats.totalEarningsHTG >= SEUIL_PEMAN 
                    ? "Felisitasyon! Limit la atenn. Ou ka transfere kòb ou kounye a." 
                    : `Lè w rive nan ${SEUIL_PEMAN.toLocaleString()} HTG, bouton an ap aktive pou MonCash.`}
            </p>

           
        </div>

        {}
        <motion.button
            whileHover={stats.totalEarningsHTG >= SEUIL_PEMAN ? { scale: 1.02 } : {}}
            whileTap={stats.totalEarningsHTG >= SEUIL_PEMAN ? { scale: 0.98 } : {}}
            disabled={stats.totalEarningsHTG < SEUIL_PEMAN}
            className={`mt-8 px-8 py-4 rounded-2xl flex items-center gap-3 text-[12px] font-black uppercase transition-all group shadow-2xl ${
                stats.totalEarningsHTG >= SEUIL_PEMAN
                    ? 'bg-black text-white shadow-black/30'
                    : 'bg-black/10 text-black/30 cursor-not-allowed border border-black/5'
            }`}
        >
            <Banknote size={18} className={stats.totalEarningsHTG >= SEUIL_PEMAN ? 'text-orange-400' : 'text-black/20'} />
            <span>Retire Kòb Ou</span>
            <ArrowUpRight size={18} className={`transition-transform duration-300 ${stats.totalEarningsHTG >= SEUIL_PEMAN ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''}`} />
        </motion.button>
    </div>

    {}
    <Wallet 
        size={180} 
        className="absolute -right-10 -bottom-10 opacity-[0.07] -rotate-12 pointer-events-none" 
    />
</motion.div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-6 rounded-[2.2rem] border border-white/[0.03] flex flex-col gap-5 text-left">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-inner`}>
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className="text-lg font-black tracking-tighter text-white mt-1">{value}</p>
        </div>
    </motion.div>
);