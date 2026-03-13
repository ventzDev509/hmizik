import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    ChevronLeft, Settings, Share2, Plus, CheckCircle,
    MapPin, Link as LinkIcon, Loader2, Play, MoreVertical,
    Music, Headphones, Instagram as InstagramIcon, Facebook, Youtube, Twitter
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Context Imports
import { useProfile } from '../../../context/ProfileContext';
import { useTracks } from '../../../context/TrackContext';

// Components
import BottomMenu from '../menu/BottomMenu';
import { useImageColors } from "../../utils/GetColor";

const UserProfile = () => {
    const navigate = useNavigate();
    const { profile, loading: profileLoading } = useProfile();
    const { tracks, fetchUserTracks, hasMore, loading: tracksLoading, incrementPlay } = useTracks();

    const [activeTab, setActiveTab] = useState('uploads');
    const [_, setPage] = useState(1);

    const { bgColor, imgRef } = useImageColors(profile?.avatarUrl ?? undefined);
    const { scrollY } = useScroll();
    const navOpacity = useTransform(scrollY, [80, 150], [0, 1]);
    const headerScale = useTransform(scrollY, [0, 100], [1, 0.95]);

    // 1. DEKODE JSON SOCIAL LINKS YO (RANJE POU EVITE CHIF)
    const socialLinks = useMemo(() => {
        if (!profile?.socialLinks) return {};
        try {
            const parsed = typeof profile.socialLinks === 'string'
                ? JSON.parse(profile.socialLinks)
                : profile.socialLinks;
            return parsed || {};
        } catch (e) {
            console.error("Erè nan Parse SocialLinks JSON", e);
            return {};
        }
    }, [profile?.socialLinks]);

    // 2. FETCH MIZIK YO (ASIRE SA AP MACHE)
    useEffect(() => {
        if (profile?.user?.id) {
            fetchUserTracks(profile.user.id, 1);
            setPage(1);
        }

    }, [profile?.user?.id]);
    useEffect(() => {
        // 1. Changer le theme-color du navigateur
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', bgColor || '#1e1e1e');
        }
    }, [bgColor])
    // 3. INFINITE SCROLL
    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 &&
            hasMore && !tracksLoading
        ) {
            setPage((prev) => {
                const nextPage = prev + 1;
                if (profile?.user?.id) {
                    fetchUserTracks(profile.user.id, nextPage);
                }
                return nextPage;
            });
        }
    }, [hasMore, tracksLoading, profile?.user?.id, fetchUserTracks]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const formatDuration = (seconds: number | undefined | null) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getPlatformIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('instagram')) return <InstagramIcon size={14} />;
        if (p.includes('facebook')) return <Facebook size={14} />;
        if (p.includes('youtube')) return <Youtube size={14} />;
        if (p.includes('tiktok')) return <Music size={14} />;
        if (p.includes('twitter') || p.includes('x')) return <Twitter size={14} />;
        return <LinkIcon size={14} />;
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-4">
                <Loader2 className="text-orange-600 animate-spin" size={40} />
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Chaje pwofil...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans relative overflow-x-hidden">

            {/* NAVIGATION BAR */}
            <motion.nav
                style={{ backgroundColor: bgColor || '#121212', opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-4 border-b border-white/5"
            >
                <div className="flex items-center gap-4">
                    <ChevronLeft size={24} onClick={() => navigate(-1)} className="cursor-pointer" />
                    <h2 className="text-xs font-black truncate max-w-[150px] uppercase tracking-tighter italic">
                        {profile?.user.name}
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <Share2 size={18} className="text-zinc-400" />
                    <Settings size={18} onClick={() => navigate("/settings")} className="text-zinc-400 cursor-pointer" />
                </div>
            </motion.nav>

            {/* HEADER / BANNER */}
            <div className="relative h-64 w-full">
                <img
                    ref={imgRef}
                    src={profile?.bannerUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop"}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="banner"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/60 to-[#121212]" />
            </div>

            <main className="relative z-10 -mt-24 px-6">
                {/* PWOFIL INFO */}
                <motion.div style={{ scale: headerScale }} className="flex flex-col">
                    <div className="relative w-32 h-32 mb-6">
                        <img
                            src={profile?.avatarUrl || "/default-avatar.png"}
                            className="w-full h-full rounded-full border-[6px] border-[#121212] object-cover shadow-2xl rotate-2"
                            alt="avatar"
                        />
                        {profile?.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-[4px] border-[#121212]">
                                <CheckCircle size={16} className="text-white fill-current" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">{profile?.user.name}</h1>
                        {profile?.isArtist && (
                            <span className="bg-orange-600 text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-widest">ATIS</span>
                        )}
                    </div>

                    <p className="text-orange-600 font-bold text-xs mb-4">@{profile?.username}</p>

                    {/* LOCATION & SOCIAL LINKS DINAMIK */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-400 shadow-sm">
                                <MapPin size={12} className="text-orange-600" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">{profile.location}</span>
                            </div>
                        )}

                        {socialLinks && Object.entries(socialLinks).map(([key, url]) => {
                            if (!url || typeof url !== 'string' || url.trim() === "") return null;

                            let platformName = key;
                            if (!isNaN(Number(key))) {
                                if (url.includes('instagram.com')) platformName = 'instagram';
                                else if (url.includes('facebook.com')) platformName = 'facebook';
                                else if (url.includes('youtube.com')) platformName = 'youtube';
                                else if (url.includes('tiktok.com')) platformName = 'tiktok';
                                else platformName = 'link';
                            }

                            return (
                                <motion.a
                                    key={key}
                                    whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
                                    whileTap={{ scale: 0.95 }}
                                    href={url.startsWith('http') ? url : `https://${platformName}.com/${url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-300 hover:text-white transition-all shadow-sm"
                                >
                                    <span className="text-orange-600 flex items-center justify-center">
                                        {getPlatformIcon(platformName)}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                                        {platformName}
                                    </span>
                                </motion.a>
                            );
                        })}

                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed mb-8 italic line-clamp-2">
                        {profile?.bio || "Mizisyen H-MIZIK. Byenveni sou paj mwen."}
                    </p>

                    <button
                        style={{ backgroundColor: "#27272a" }}
                        onClick={() => navigate("/editeProfile")}
                        className="w-full py-4 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-lg"
                    >
                        MODIFYE PWOFIL
                    </button>
                </motion.div>

                {/* TABS SELECTION */}
                <div className="sticky top-14 z-40 bg-[#121212] border mt-10 flex  border-white/5">
                    {['uploads', 'playlists', 'likes'].map((tab) => (
                        <button
                            style={{ outline: "none", border: "none", backgroundColor: "#121212" }}
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all outline-none border-none ${activeTab === tab ? 'text-orange-600 border-b-2 border-orange-600' : 'text-zinc-600'
                                }`}
                        >
                            {tab === 'uploads' ? 'Mizik' : tab === 'playlists' ? 'Playlists' : 'Favori'}
                        </button>
                    ))}
                </div>

                {/* LIST KONTNI */}
                <div className="py-8 pb-32">
                    <AnimatePresence mode="wait">
                        {activeTab === 'uploads' ? (
                            <motion.div
                                key="tracks"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
                                {tracks && tracks.length > 0 ? (
                                    tracks.map((track) => (
                                        <motion.div
                                            key={track.id}
                                            onClick={() => incrementPlay(track.id)}
                                            className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer border border-white/[0.02]"
                                        >
                                            <div className="relative w-14 h-14 flex-shrink-0">
                                                <img
                                                    src={track.coverUrl || "/default-music.png"}
                                                    className="w-full h-full object-cover rounded-xl shadow-lg"
                                                    alt={track.title}
                                                />
                                                <div className="absolute inset-0 bg-orange-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                    <Play size={20} className="fill-white text-white" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-black truncate uppercase italic tracking-tight">{track.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[9px] text-orange-600 font-black uppercase tracking-widest">{track.genre}</span>
                                                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase">
                                                        <Headphones size={10} /> {track.playCount?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-mono text-zinc-500">{formatDuration(track.duration)}</span>
                                                <button className="p-2 hover:bg-white/5 rounded-full">
                                                    <MoreVertical size={16} className="text-zinc-500" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : !tracksLoading && (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                        <Music size={40} />
                                        <p className="text-[10px] font-black mt-4 uppercase tracking-[0.25em]">Poko gen anyen</p>
                                    </div>
                                )}
                                {tracksLoading && (
                                    <div className="flex justify-center py-6">
                                        <Loader2 className="text-orange-600 animate-spin" size={24} />
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 opacity-20"
                            >
                                <Music size={40} />
                                <p className="text-[10px] font-black mt-4 uppercase tracking-[0.25em]">Paj sa a poko pare</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* FLOATING ACTION BUTTON */}
            {profile?.isArtist && (
                <motion.button
                    style={{ backgroundColor: "oklch(64.6% 0.222 41.116) " }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate("/nouvoson")}
                    className="fixed bottom-44 right-6 w-16 h-16 bg-orange-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-600/10 z-[90] border-2 border-white/10 text-white"
                >
                    <Plus size={32} strokeWidth={3} />
                </motion.button>
            )}

            <BottomMenu />
        </div>
    );
};

export default UserProfile;