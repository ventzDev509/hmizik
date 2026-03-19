import { motion, MotionValue } from 'framer-motion';
import { CheckCircle, MapPin, Settings, Share2, ChevronLeft, Disc } from 'lucide-react';
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
}: ProfileHeaderProps) => (
    <>
        <motion.nav
            style={{ backgroundColor: bgColor || '#121212', opacity: navOpacity }}
            className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-4 border-b border-white/5"
        >
            <div className="flex items-center gap-4">
                <ChevronLeft size={24} onClick={() => navigate(-1)} className="cursor-pointer" />
                <h2 className="text-xs font-black truncate max-w-[150px] uppercase tracking-tighter italic">{profile?.user.name}</h2>
            </div>
            <div className="flex items-center gap-4">
                <Share2 size={18} className="text-zinc-400" />
                <Settings size={18} onClick={() => navigate("/settings")} className="text-zinc-400 cursor-pointer" />
            </div>
        </motion.nav>

        <div className="relative h-64 w-full">
            <img ref={imgRef} src={profile?.bannerUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"} className="absolute inset-0 w-full h-full object-cover" alt="banner" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/60 to-[#121212]" />
        </div>

        <main className="relative z-10 -mt-24 px-6">
            <motion.div style={{ scale: headerScale }} className="flex flex-col">
                <div className="relative w-32 h-32 mb-6">
                    <img src={profile?.avatarUrl || "/default-avatar.png"} className="w-full h-full rounded-full border-[6px] border-[#121212] object-cover shadow-2xl rotate-2" alt="avatar" />
                    {profile?.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-[4px] border-[#121212]">
                            <CheckCircle size={16} className="text-white fill-current" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">{profile?.user.name}</h1>
                    {profile?.isArtist && <span className="bg-orange-600 text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-widest">ATIS</span>}
                </div>
                <p className="text-orange-600 font-bold text-xs mb-4">@{profile?.username}</p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
                    {profile?.location && (
                        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-400">
                            <MapPin size={12} className="text-orange-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{profile.location}</span>
                        </div>
                    )}
                    {Array.isArray(socialLinks) ? (
                        socialLinks.map((url, index) => (
                            url && (
                                <motion.a
                                    key={index}
                                    whileHover={{ y: -2 }}
                                    href={String(url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-300"
                                >
                                    <span className="text-orange-600">
                                        {getPlatformIcon(String(url))}
                                    </span>

                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                       
                                        Link {index + 1}
                                    </span>
                                </motion.a>
                            )
                        ))
                    ) : (
                        Object.entries(socialLinks).map(([key, url]) => (
                            <motion.a key={key} href={String(url)} className="...">
                                <span className="text-orange-600">{getPlatformIcon(String(url))}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest">{key}</span>
                            </motion.a>
                        ))
                    )}
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed mb-8 italic line-clamp-2">{profile?.bio || "Mizisyen H-MIZIK."}</p>

                <div className="flex flex-col gap-3">
                    <div onClick={() => navigate("/editeProfile")} className="w-full text-center py-4 bg-zinc-900 border border-white/10 rounded-2xl font-black text-[10px] tracking-[0.2em]">MODIFYE PWOFIL</div>
                    {profile?.isArtist && (
                        <div onClick={() => setIsAlbumModalOpen(true)} className="w-full py-4 bg-orange-600/10 border border-orange-600/20 rounded-2xl font-black text-[10px] tracking-[0.2em] text-orange-600 flex items-center justify-center gap-2">
                            <Disc size={16} /> KREYE YON ALBUM
                        </div>
                    )}
                </div>
            </motion.div>
        </main>
    </>
);