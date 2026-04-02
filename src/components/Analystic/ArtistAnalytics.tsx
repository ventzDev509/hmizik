import  { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Headphones,
    Music,
    ArrowUpRight,
    BarChart3,
    Wallet,
    Info,
    MapPin,
    Lightbulb
} from 'lucide-react';
import type { Track } from '../types/Profile';

interface AnalyticsProps {
    tracks: Track[];
}

export const ArtistAnalytics = ({ tracks }: AnalyticsProps) => {
    // 1. KONFIGIRASYON MONETIZASYON
    const TARIF_HTG = 0.20;
    const SEUIL_PEMAN = 2500; // Papòt pou retire kòb (HTG)

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

    const topTracks = [...tracks]
        .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        .slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=" space-y-8"
        >
            {/* HEADER */}
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

            {/* GRID KAT STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={<Headphones className="text-orange-600" size={20} />}
                    label="Total Ekout"
                    value={stats.totalPlays.toLocaleString()}
                    color="bg-orange-600/10"
                />
                <StatCard
                    icon={<Wallet className="text-green-500" size={20} />}
                    label="Revni (HTG)"
                    value={`${stats.totalEarningsHTG.toLocaleString()} HTG`}
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

            {/* PROGRESS BAR POU PEMAN */}
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
                        <p className="text-xs font-black text-orange-600">{stats.remainingHTG.toLocaleString()} HTG</p>
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

            {/* TOP TRACKS & VIL YO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LIS TOP 5 */}
                <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/[0.03]">
                    <h3 className="text-sm font-black uppercase italic flex items-center gap-2 text-white mb-8">
                        <BarChart3 size={18} className="text-orange-600" />
                        Top 5 Mizik yo
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

                {/* VIL YO & KONSÈY */}
                <div className="space-y-4">
                    <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/[0.03]">
                        <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-6 flex items-center gap-2">
                            <MapPin size={14} className="text-orange-600" />
                            Top Vil kote yo koute w
                        </h4>
                        <div className="space-y-4">
                            {[
                                { v: 'Pòtoprens', p: '45%' },
                                { v: 'Okap', p: '32%' },
                                { v: 'Jakmèl', p: '12%' },
                                { v: 'Lòt bò dlo', p: '11%' }
                            ].map((loc) => (
                                <div key={loc.v} className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-white uppercase w-20">{loc.v}</span>
                                    <div className="flex-1 px-4">
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-zinc-600 rounded-full" style={{ width: loc.p }} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-500">{loc.p}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-orange-600/5 rounded-[2.5rem] p-8 border border-orange-600/10 flex flex-col justify-center text-left">
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-600/20">
                            <Lightbulb size={20} className="text-black" />
                        </div>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest italic">Konsèy pou ou</p>
                        <p className="text-xs font-bold text-zinc-300 mt-2 leading-relaxed italic">
                            Mizik ou yo ap "boule" nan <span className="text-white">Okap</span> mwa sa a. Pataje lyen an plis nan zòn sa a pou w rive nan peman an pi vit!
                        </p>
                    </div>
                </div>
            </div>

            {/* BOUTON PEMAN FINAL */}
            <div className="bg-orange-600 rounded-[2.5rem] p-10 text-black relative overflow-hidden shadow-2xl shadow-orange-600/30">
                <div className="relative z-10 text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest bg-black/10 inline-block px-3 py-1 rounded-full mb-3">Retrè MonCash</p>
                    <h3 className="text-2xl font-black uppercase italic leading-none">
                        Fè kòb ak vwa ou. <br /> Resevwa HTG pa w la.
                    </h3>
                    <p className="text-[11px] font-bold mt-4 opacity-80 max-w-[300px]">
                        Peman yo deklanche otomatikman via MonCash chak fwa ou rive nan papòt 2,500 HTG a.
                    </p>
                    <button
                        disabled={stats.totalEarningsHTG < SEUIL_PEMAN}
                        className={`mt-8 px-10 py-5 rounded-full flex items-center gap-3 text-[11px] font-black uppercase transition-all shadow-xl ${stats.totalEarningsHTG >= SEUIL_PEMAN
                                ? 'bg-black text-white hover:scale-105 active:scale-95'
                                : 'bg-black/20 text-black/40 cursor-not-allowed'
                            }`}
                    >
                        Retire Kòb Ou <ArrowUpRight size={16} />
                    </button>
                </div>
                <Wallet size={160} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
            </div>

            {/* REMAK SEKIRITE */}
            <div className="flex items-start gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/5 text-left">
                <Info size={18} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                <p className="text-[9px] text-zinc-600 leading-relaxed font-bold uppercase tracking-tight">
                    H-MIZIK Verifye: Done yo filtre pou evite fwod (fòs ekout). Se sèlman moun ki tande plis pase 30 segond ki konte.
                    Frè sèvis 5% dedui sou chak peman pou kouvri depans tranzaksyon yo.
                </p>
            </div>
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