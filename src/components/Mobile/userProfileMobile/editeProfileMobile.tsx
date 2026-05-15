import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Camera, MapPin, Loader2, Instagram, Youtube, Music2, Facebook, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';


import userImg from "../../../assets/OIP.webp";
import banner from "../../../assets/banner.jpg";
import BottomMenu from '../menu/BottomMenu';


import { useProfile } from '../../../context/ProfileContext';
import { compressImage } from '../../utils/compressor';

const EditProfileMobile: React.FC = () => {
    const { profile, loading, updateProfile } = useProfile();
    const [isSaving, setIsSaving] = useState(false);

    
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        location: "",
        avatarUrl: "",
        bannerUrl: "",
        socialLinks: {
            instagram: "",
            youtube: "",
            tiktok: "",
            facebook: ""
        }
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.username || "",
                bio: profile.bio || "",
                location: profile.location || "",
                avatarUrl: profile.avatarUrl || userImg,
                bannerUrl: profile.bannerUrl || banner,
                socialLinks: {
                    instagram: profile.socialLinks?.instagram || "",
                    youtube: profile.socialLinks?.youtube || "",
                    tiktok: profile.socialLinks?.tiktok || "",
                    facebook: profile.socialLinks?.facebook || ""
                }
            });
        }
    }, [profile]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    
    const handleSocialChange = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [platform]: value }
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>, type: 'avatarUrl' | 'bannerUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [type]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return toast.error("Non an obligatwa");

        setIsSaving(true);
        const dataToSend = new FormData();

        dataToSend.append('username', formData.name);
        dataToSend.append('bio', formData.bio);
        dataToSend.append('location', formData.location);
        dataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));

        const avatarInput = document.getElementById('avatarInput') as HTMLInputElement;
        const bannerInput = document.getElementById('bannerInput') as HTMLInputElement;

        try {
            if (avatarInput?.files?.[0]) {
                const compressedAvatar = await compressImage(avatarInput.files[0]);
                dataToSend.append('avatar', compressedAvatar, 'avatar.jpg');
            }
            if (bannerInput?.files?.[0]) {
                const compressedBanner = await compressImage(bannerInput.files[0]);
                dataToSend.append('banner', compressedBanner, 'banner.jpg');
            }

            await updateProfile(dataToSend);
            toast.success('Pwofil sove ak siksè!');
        } catch (error) {
            toast.error('Erè nan anrejistreman');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="fixed inset-0 bg-[#121212] flex items-center justify-center text-white">
            <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="fixed inset-0 bg-[#121212] flex flex-col z-[9999]"
            >
                {}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-50">
                    <button onClick={() => window.history.back()} className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Anile</button>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white italic">Edite Pwofil</h2>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`text-xs font-black uppercase tracking-widest ${isSaving ? 'text-zinc-700' : 'text-orange-500'}`}
                    >
                        {isSaving ? '...' : 'Sove'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pb-32">
                    {}
                    <div className="relative h-48 bg-zinc-900">
                        <img src={formData.bannerUrl} className="w-full h-full object-cover opacity-50" alt="Banner" />
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                            <Camera size={20} className="text-white/50 mb-2" />
                            <input id="bannerInput" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'bannerUrl')} className="hidden" />
                        </label>
                    </div>

                    {}
                    <div className="px-6 -mt-16 mb-10 flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full border-[6px] border-[#121212] bg-zinc-800 overflow-hidden group shadow-2xl">
                            <img src={formData.avatarUrl} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={24} className="text-white" />
                                <input id="avatarInput" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'avatarUrl')} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {}
                    <div className="px-6 space-y-10">
                        
                        {}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Info size={14} /> Enfòmasyon Pèsonèl
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Non Atis</label>
                                <input 
                                    name="name" value={formData.name} onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:border-orange-500/30 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 italic">Biyografi</label>
                                <textarea 
                                    name="bio" value={formData.bio} onChange={handleChange} rows={3}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none resize-none focus:border-orange-500/30 transition-all text-sm leading-relaxed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 flex items-center gap-1">
                                    <MapPin size={10} /> Lokalizasyon
                                </label>
                                <input 
                                    name="location" value={formData.location} onChange={handleChange}
                                    placeholder="Ex: Port-au-Prince, Haiti"
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:border-orange-500/30 transition-all"
                                />
                            </div>
                        </div>

                        {}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Rezo Sosyal</h3>
                            
                            <div className="grid gap-4">
                                <SocialInput 
                                    icon={<Instagram size={18} />} 
                                    placeholder="Username Instagram" 
                                    value={formData.socialLinks.instagram} 
                                    onChange={(v:any) => handleSocialChange('instagram', v)}
                                />
                                <SocialInput 
                                    icon={<Youtube size={18} />} 
                                    placeholder="Link Youtube Channel" 
                                    value={formData.socialLinks.youtube} 
                                    onChange={(v:any) => handleSocialChange('youtube', v)}
                                />
                                <SocialInput 
                                    icon={<Music2 size={18} />} 
                                    placeholder="Username TikTok" 
                                    value={formData.socialLinks.tiktok} 
                                    onChange={(v:any) => handleSocialChange('tiktok', v)}
                                />
                                <SocialInput 
                                    icon={<Facebook size={18} />} 
                                    placeholder="Link Facebook" 
                                    value={formData.socialLinks.facebook} 
                                    onChange={(v:any) => handleSocialChange('facebook', v)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <BottomMenu />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};


const SocialInput = ({ icon, placeholder, value, onChange }: any) => (
    <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors">
            {icon}
        </div>
        <input 
            type="text" 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-5 text-sm text-white outline-none focus:border-orange-500/30 transition-all placeholder:text-zinc-700"
        />
    </div>
);

export default EditProfileMobile;