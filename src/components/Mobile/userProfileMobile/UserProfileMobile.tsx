import { useState, useEffect, useMemo } from 'react';
import { Plus, Loader2, LinkIcon, FilePlay } from 'lucide-react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Enpòtasyon konpozan nou separe yo
import { ProfileHeader } from './composants/ProfileHeader';
import AlbumModal from './composants/AlbumModal';

// Contexts & Utils
import { useProfile } from '../../../context/ProfileContext';
import { useTracks } from '../../../context/TrackContext';
import { useAlbum } from '../../../context/AlbumContext';
import { useImageColors } from "../../utils/GetColor";
import BottomMenu from '../menu/BottomMenu';
import type { AlbumFormState } from '../../types/Profile';
import { ProfileContent } from './composants/ProfileContent';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const UserProfile = () => {
    const navigate = useNavigate();

    // CONTEXTS
    const { profile, loading: profileLoading } = useProfile();
    const { tracks, fetchUserTracks, loading: tracksLoading, incrementPlay } = useTracks();
    const { albums, deleteAlbum, createAlbum, isUploading, uploadProgress, error, fetchUserAlbums } = useAlbum();

    // STATES
    const [activeTab, setActiveTab] = useState('uploads');
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [albumForm, setAlbumForm] = useState<AlbumFormState>({
        title: '', releaseDate: '', cover: null, preview: ''
    });

    const getPlatformIcon = (url: string) => {
        const u = String(url).toLowerCase();
        if (u.includes('instagram.com')) return <FiInstagram size={14} />;
        if (u.includes('facebook.com') || u.includes('fb.com')) return <FiFacebook size={14} />;
        if (u.includes('youtube.com') || u.includes('youtu.be')) return <FiYoutube size={14} />;
        if (u.includes('twitter.com') || u.includes('x.com')) return <FiTwitter size={14} />;
        if (u.includes('tiktok.com') || u.includes('tik.com')) return <FilePlay size={14} />;
        return <LinkIcon size={14} />;
    };
    // DESIGN & ANIMATION
    const { bgColor, imgRef } = useImageColors(profile?.avatarUrl ?? undefined);
    const { scrollY } = useScroll();
    const navOpacity = useTransform(scrollY, [80, 150], [0, 1]);
    const headerScale = useTransform(scrollY, [0, 100], [1, 0.95]);

    // INITIAL FETCH
    useEffect(() => {
        if (profile?.user?.id) {
            fetchUserTracks(profile.user.id, 1);
            fetchUserAlbums(profile.id);
        }

    }, [profile?.user?.id]);

    // HANDLERS
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAlbumForm({ ...albumForm, cover: file, preview: URL.createObjectURL(file) });
        }
    };

    const onSubmitAlbum = async () => {
        if (!albumForm.title || !albumForm.cover || !profile?.user?.id) return;
        const formData = new FormData();
        formData.append('title', albumForm.title);
        formData.append('cover', albumForm.cover);
        formData.append('releaseDate', albumForm.releaseDate);
        formData.append('artistId', profile.id);

        await createAlbum(formData);
        if (!error) {
            setIsAlbumModalOpen(false);
            setAlbumForm({ title: '', releaseDate: '', cover: null, preview: '' });
        }
    };

    const socialLinks = useMemo(() => {
        if (!profile?.socialLinks) return {};
        try {
            return typeof profile.socialLinks === 'string' ? JSON.parse(profile.socialLinks) : profile.socialLinks;
        } catch (e) { return {}; }
    }, [profile?.socialLinks]);

    useEffect(() => {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.setAttribute('content', '#121212');

        return () => {
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.setAttribute('content', '#121212');
            }
        };
    }, [bgColor]);

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-4">
                <Loader2 className="text-orange-500 animate-spin" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Chaje pwofil...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden relative">

            {/* 1. HEADER */}
            <ProfileHeader
                profile={profile} bgColor={"#121212"} navOpacity={navOpacity}
                headerScale={headerScale} socialLinks={socialLinks}
                getPlatformIcon={getPlatformIcon}
                navigate={navigate} imgRef={imgRef} setIsAlbumModalOpen={setIsAlbumModalOpen}
            />

            <div className="p-8">
                {/* 2. CONTENT (TABS & LIS) */}
                <ProfileContent
                    activeTab={activeTab} setActiveTab={setActiveTab}
                    tracks={tracks} albums={albums}
                    deleteAlbum={deleteAlbum}
                    tracksLoading={tracksLoading} incrementPlay={incrementPlay}
                    setIsAlbumModalOpen={setIsAlbumModalOpen} navigate={navigate}
                />

                {/* 3. MODAL */}
                <AlbumModal
                    isOpen={isAlbumModalOpen} onClose={() => setIsAlbumModalOpen(false)}
                    albumForm={albumForm} setAlbumForm={setAlbumForm}
                    onSubmit={onSubmitAlbum} isUploading={isUploading}
                    uploadProgress={uploadProgress} error={error}
                    handleFileChange={handleFileChange}
                />

                {/* 4. FAB BUTTON */}
                {profile?.isArtist && (
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate("/nouvoson")}
                        className="fixed bottom-40 right-6 w-16 h-16 bg-orange-500 rounded-[2rem] flex items-center justify-center shadow-2xl z-[90] border-2 border-white/10 text-white"
                    >
                        <Plus size={32} strokeWidth={3} />
                    </motion.div>
                )}

            </div>
            <BottomMenu />
        </div>
    );
};

export default UserProfile;