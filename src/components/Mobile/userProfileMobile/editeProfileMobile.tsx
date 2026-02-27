import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Camera, Globe, Plus, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Assets & Menu
import userImg from "../../../assets/OIP.webp";
import banner from "../../../assets/banner.jpg";
import BottomMenu from '../menu/BottomMenu';

// Contexts
import { useProfile } from '../../../context/ProfileContext';
import { compressImage } from '../../utils/compressor';

const EditProfileMobile: React.FC = () => {
    const { profile, loading, updateProfile } = useProfile();
    const [isSaving, setIsSaving] = useState(false);

    // State pou tout fòm nan
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        avatarUrl: "", // Sa ap sèvi pou preview vizyèl la sèlman
        bannerUrl: "", // Sa ap sèvi pou preview vizyèl la sèlman
        socialLinks: [""]
    });

    // Ranpli fòm nan ak done ki soti nan Context la
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.user?.name || "",
                bio: profile.bio || "",
                avatarUrl: profile.avatarUrl || userImg,
                bannerUrl: profile.bannerUrl || banner,
                socialLinks: Array.isArray(profile.socialLinks) && profile.socialLinks.length > 0
                    ? profile.socialLinks
                    : [""]
            });
        }
    }, [profile]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Jere chanjman foto yo (Preview lokal + idantifye input la)
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

    // --- LOGIK POU SOCIAL LINKS ---
    const handleSocialChange = (index: number, value: string) => {
        const newLinks = [...formData.socialLinks];
        newLinks[index] = value;
        setFormData(prev => ({ ...prev, socialLinks: newLinks }));
    };

    const addSocialLink = () => {
        if (formData.socialLinks.length < 5) {
            setFormData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, ""] }));
        } else {
            toast.error("Ou pa ka ajoute plis pase 5 lyen");
        }
    };

    const removeSocialLink = (index: number) => {
        const newLinks = formData.socialLinks.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, socialLinks: newLinks.length ? newLinks : [""] }));
    };

    // --- FONKSYON POU SOVE (FormData pou Supabase) ---
    const handleSave = async () => {
        if (!formData.name.trim()) return toast.error("Non an obligatwa");

        setIsSaving(true);
        const dataToSend = new FormData();

        dataToSend.append('username', formData.name);
        dataToSend.append('bio', formData.bio);
        dataToSend.append('socialLinks', JSON.stringify(formData.socialLinks.filter(l => l.trim() !== "")));

        // Rekipere fichye orijinal yo
        const avatarInput = document.getElementById('avatarInput') as HTMLInputElement;
        const bannerInput = document.getElementById('bannerInput') as HTMLInputElement;

        // KONPRESYON AVANT UPLOAD
        if (avatarInput?.files?.[0]) {
            const compressedAvatar = await compressImage(avatarInput.files[0]);
            dataToSend.append('avatar', compressedAvatar, 'avatar.jpg');
        }

        if (bannerInput?.files?.[0]) {
            const compressedBanner = await compressImage(bannerInput.files[0]);
            dataToSend.append('banner', compressedBanner, 'banner.jpg');
        }

        try {
            await updateProfile(dataToSend);
            toast.success('Pwofil sove ak siksè (optimisé)!');
        } catch (error) {
            toast.error('Erè nan upload la');
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
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 bg-[#121212] flex flex-col z-[99999]"
            >
                {/* 1. TOP NAV BAR */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-50">
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Edite Pwofil</h2>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`text-sm font-black uppercase ${isSaving ? 'text-zinc-600' : 'text-orange-500 active:scale-90'}`}
                    >
                        {isSaving ? 'Ap sove...' : 'Sove'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">

                    {/* 2. BANNER SECTION */}
                    <div className="relative h-44 bg-zinc-900 overflow-hidden">
                        <img
                            src={formData.bannerUrl || banner}
                            className="w-full h-full object-cover opacity-60"
                            alt="Banner"
                        />
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/20">
                            <Camera size={24} className="text-white/70 mb-1" />
                            <span className="text-[10px] font-bold uppercase text-white/70">Chanje Foto Kouvèti</span>
                            <input
                                id="bannerInput"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'bannerUrl')}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* 3. PROFILE PHOTO */}
                    <div className="px-6 -mt-14 mb-8 flex flex-col items-center">
                        <div className="relative w-32 h-32">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#121212] bg-zinc-800 shadow-2xl">
                                <img
                                    src={formData.avatarUrl || userImg}
                                    className="w-full h-full object-cover brightness-75"
                                    alt="Avatar"
                                />
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/20 rounded-full transition-all">
                                <Camera size={28} className="text-white" />
                                <input
                                    id="avatarInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'avatarUrl')}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* 4. TOUT INPUT YO */}
                    <div className="px-6 space-y-8 pb-40">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Non ki pou parèt</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-white/5 rounded-lg py-3 px-4 text-white outline-none focus:border-orange-500/50 font-bold"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Biyografi (Apropo)</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Pale de tèt ou..."
                                className="w-full bg-zinc-900 border border-white/5 rounded-lg py-3 px-4 text-white outline-none resize-none text-sm"
                            />
                            <div className="text-[10px] text-right text-zinc-600">{formData.bio.length}/150</div>
                        </div>

                        {/* SOCIAL LINKS */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500">Lyen Sosyal</h3>
                                <button
                                    onClick={addSocialLink}
                                    className="flex items-center gap-1 text-[10px] font-bold bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-full border border-orange-500/20"
                                >
                                    <Plus size={12} /> AJOUTE LYEN
                                </button>
                            </div>

                            {formData.socialLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 group">
                                    <div className="flex-1 flex items-center gap-3 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
                                        <div className="w-10 h-10 flex items-center justify-center text-zinc-500 bg-white/5 rounded-lg">
                                            <Globe size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="https://lyen-ou.com"
                                            value={link}
                                            onChange={(e) => handleSocialChange(index, e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm text-white"
                                        />
                                    </div>
                                    {formData.socialLinks.length > 1 && (
                                        <button
                                            onClick={() => removeSocialLink(index)}
                                            className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-[#121212] z-50">
                    <BottomMenu />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditProfileMobile;