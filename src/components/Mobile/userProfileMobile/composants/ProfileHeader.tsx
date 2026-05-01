import { motion, MotionValue } from 'framer-motion';
import { CheckCircle, MapPin, Settings, Share2, ChevronLeft, Disc, Link as LinkIcon } from 'lucide-react';
import React from 'react';

interface ProfileHeaderProps {
    profile: any;
    bgColor: string;
    navOpacity: MotionValue<number>;
    headerScale: MotionValue<number>;
    socialLinks: Record<string, any>;
    getPlatformIcon: (platform: string) => React.ReactElement;
    navigate: any;
    imgRef: any;
    setIsAlbumModalOpen: (open: boolean) => void;
}

export const ProfileHeader = ({
    profile, bgColor, navOpacity, headerScale, socialLinks,
    getPlatformIcon, navigate, imgRef, setIsAlbumModalOpen
}: ProfileHeaderProps) => {
    
    // Fonksyon pou netwaye non kle sosyal yo (ex: instagram -> INSTAGRAM)
    const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

    return (
        <>
            {/* --- STICKY NAVIGATION --- */}
            <motion.nav
                style={{ backgroundColor: bgColor || '#09090b', opacity: navOpacity }}
                className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-6 backdrop-blur-md border-b border-white/5"
            >
                <div className="flex items-center gap-4">
                    <div 
                        onClick={() => navigate(-1)} 
                        className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={22} className="text-white" />
                    </div>
                    <h2 className="text-[10px] font-black truncate max-w-[150px] uppercase tracking-[0.2em] italic text-white/90">
                        {profile?.user?.name}
                    </h2>
                </div>
                <div className="flex items-center gap-5">
                    <Share2 size={18} className="text-zinc-400 hover:text-white transition-colors" />
                    <Settings 
                        size={18} 
                        onClick={() => navigate("/settings")} 
                        className="text-zinc-400 hover:text-white cursor-pointer transition-colors" 
                    />
                </div>
            </motion.nav>

            {/* --- HERO BANNER --- */}
            <div className="relative h-72 w-full overflow-hidden">
                <motion.img 
                    ref={imgRef} 
                    src={profile?.bannerUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"} 
                    className="absolute inset-0 w-full h-full object-cover shadow-inner" 
                    alt="banner" 
                />
                {/* Gradient Overlay pou pi bon lizibilite */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#09090b]/40 to-[#09090b]" />
            </div>

            {/* --- PROFILE CONTENT --- */}
            <main className="relative z-10 -mt-20 px-6">
                <motion.div style={{ scale: headerScale }} className="flex flex-col">
                    
                    {/* Avatar & Verification */}
                    <div className="relative w-32 h-32 mb-5 group">
                        <div className="w-full h-full rounded-3xl overflow-hidden border-[4px] border-[#09090b] bg-zinc-800 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-400">
                            <img 
                                src={profile?.avatarUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"} 
                                className="w-full h-full object-cover" 
                                alt="avatar" 
                            />
                        </div>
                        {profile?.verified && (
                            <div className="absolute -bottom-2 -right-2 bg-blue-400 rounded-full p-1.5 border-[4px] border-[#09090b] shadow-lg">
                                <CheckCircle size={14} className="text-white fill-current" />
                            </div>
                        )}
                    </div>

                    {/* Name & Badge */}
                    <div className="flex items-end gap-3 mb-1">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">
                            {profile?.user?.name}
                        </h1>
                        {profile?.isArtist && (
                            <span className="mb-1 bg-gradient-to-r from-orange-400 to-orange-400 text-[7px] px-2 py-0.5 rounded-sm font-black uppercase tracking-widest text-white">
                                ATIS
                            </span>
                        )}
                    </div>
                    <p className="text-orange-400 font-black text-[10px] tracking-widest uppercase mb-6">
                        @{profile?.username || 'username'}
                    </p>

                    {/* Info Chips (Location & Socials) */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        {profile?.location && (
                            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-zinc-300 backdrop-blur-sm">
                                <MapPin size={11} className="text-orange-400" />
                                <span className="text-[9px] font-bold uppercase tracking-wider">{profile.location}</span>
                            </div>
                        )}

                        {/* Dinamik Social Links */}
                        {socialLinks && Object.entries(socialLinks).map(([key, url]) => (
                            url && (
                                <motion.a
                                    key={key}
                                    whileTap={{ scale: 0.95 }}
                                    href={String(url).startsWith('http') ? String(url) : `https://${url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-zinc-300 hover:bg-white/10 transition-all"
                                >
                                    <span className="text-orange-400">
                                        {getPlatformIcon(key) || <LinkIcon size={11} />}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider">
                                        {formatKey(key)}
                                    </span>
                                </motion.a>
                            )
                        ))}
                    </div>

                    {/* Bio Section */}
                    <div className="relative mb-8">
                        <div className="absolute left-0 top-0 w-1 h-full bg-orange-400/30 rounded-full" />
                        <p className="pl-4 text-sm text-zinc-400 leading-relaxed italic font-medium">
                            {profile?.bio || "Mizisyen H-MIZIK. Pasyone pa kreyasyon son ak melodi."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3 ">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/editeProfile")}
                            className="w-full py-4 bg-zinc-900 border border-white/5 rounded-2xl font-black text-[9px] tracking-[0.2em] text-white hover:bg-zinc-800 transition-colors uppercase shadow-xl"
                        >
                            Modifye Pwofil
                        </motion.button>

                        {profile?.isArtist && (
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsAlbumModalOpen(true)}
                                className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-400 rounded-2xl font-black text-[9px] tracking-[0.2em] text-white flex items-center justify-center gap-3 shadow-lg shadow-orange-400/20 uppercase"
                            >
                                <Disc size={16} className="animate-spin-slow" /> 
                                Kreye yon Album
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* Custom CSS pou animasyon spin lan si w vle */}
            <style>{`
                .animate-spin-slow {
                    animation: spin 6s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};