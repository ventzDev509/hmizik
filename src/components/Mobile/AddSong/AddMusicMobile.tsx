import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Upload, Image as ImageIcon, X, Loader2, CheckCircle2, Activity } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTracks } from '../../../context/TrackContext';
import { useAlbum } from '../../../context/AlbumContext';

const AddMusicMobile: React.FC = () => {
    // Hooks Context
    const { uploadTrack, uploading: isUploadingSingle } = useTracks();
    const { addTrack, isUploading: isUploadingAlbum, uploadProgress } = useAlbum();
    
    // Hooks Navigasyon
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Detekte mòd operasyon
    const albumId = searchParams.get('albumId');
    const isAddingToAlbum = Boolean(albumId);

    // States lokal pou fichye
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [isProcessingAudio, setIsProcessingAudio] = useState(false);

    // State pou fòm
    const [formData, setFormData] = useState({
        title: '',
        genre: 'Konpa',
        description: '',
    });

    // Refs
    const audioInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Compute uploading status
    const combinedUploading = isUploadingSingle || isUploadingAlbum;

    // Kalkile longè mizik la (Analyzing Buffer)
    const getAudioDuration = (file: File): Promise<number> => {
        setIsProcessingAudio(true);
        return new Promise((resolve) => {
            const audio = new Audio();
            const url = URL.createObjectURL(file);
            audio.src = url;
            audio.onloadedmetadata = () => {
                setIsProcessingAudio(false);
                resolve(Math.round(audio.duration));
                URL.revokeObjectURL(url);
            };
            audio.onerror = () => {
                setIsProcessingAudio(false);
                toast.error("Erè nan lekti fichye audio a");
                resolve(0);
            };
        });
    };

    const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('audio/')) {
                setAudioFile(file);
                const dur = await getAudioDuration(file);
                setDuration(dur);

                if (!formData.title) {
                    setFormData(prev => ({ 
                        ...prev, 
                        title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ") 
                    }));
                }
            } else {
                toast.error("Tanpri chwazi yon fichye audio valid");
            }
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setCoverPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!audioFile) return toast.error("Ou dwe chwazi yon mizik");
        if (!formData.title) return toast.error("Mizik la bezwen yon tit");
        if (isProcessingAudio) return toast.error("N ap analize audio a toujou...");

        const data = new FormData();
        data.append('title', formData.title);
        data.append('duration', duration.toString());
        data.append('audio', audioFile);
        
        if (coverFile) {
            data.append('cover', coverFile);
        }

        try {
            if (isAddingToAlbum && albumId) {
                await addTrack(albumId, data);
                toast.success("Mizik ajoute nan album nan!");
            } else {
                data.append('genre', formData.genre);
                await uploadTrack(data);
                toast.success("Mizik pibliye ak siksè!");
            }

            setTimeout(() => {
                isAddingToAlbum ? navigate(`/album?id=${albumId}`) : navigate('/profile');
            }, 2000);

        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Upload la echwe. Tcheke koneksyon ou.");
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans pb-32">
            <Toaster position="top-center" reverseOrder={false} />

            {/* --- OVERLAY UPLOAD PROGRESS VIZYALIZÈ --- */}
            <AnimatePresence>
                {combinedUploading && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center px-10"
                    >
                        <div className="w-full max-w-xs space-y-8 text-center">
                            <div className="relative flex justify-center">
                                <div className="relative">
                                    <Loader2 className="animate-spin text-orange-600 opacity-20" size={100} strokeWidth={1} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black font-mono text-orange-500">
                                            {uploadProgress}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-black uppercase tracking-widest italic">
                                    {uploadProgress < 100 ? "N ap Transfere..." : "Processing..."}
                                </h2>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">H-MIZIK Cloud Storage</p>
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ ease: "easeOut", duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 sticky top-0 bg-[#121212]/95 backdrop-blur-md z-40">
                <div onClick={() => navigate(-1)} className="p-2 bg-zinc-900 rounded-lg cursor-pointer">
                    <X className="text-zinc-400" size={18} />
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 italic">
                    {isAddingToAlbum ? "Add to Album" : "Upload Single"}
                </h2>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8 max-w-md mx-auto">
                {/* COVER PICKER */}
                <div className="flex flex-col items-center">
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => coverInputRef.current?.click()}
                        className="relative w-64 h-64 bg-zinc-900 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center overflow-hidden border border-white/5 group cursor-pointer"
                    >
                        {coverPreview ? (
                            <img src={coverPreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <div className="flex flex-col items-center p-6 text-center">
                                <ImageIcon size={40} className="text-zinc-800 mb-3" />
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                    {isAddingToAlbum ? "Track Cover (Optional)" : "Single Cover"}
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-orange-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                            <Upload size={30} className="text-white" />
                        </div>
                    </motion.div>
                    <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                </div>

                {/* AUDIO SELECTOR SECTION */}
                <div className="space-y-3">
                    <div
                        onClick={() => !isProcessingAudio && audioInputRef.current?.click()}
                        className={`w-full p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-4 ${audioFile ? 'border-orange-600/50 bg-orange-600/5 shadow-[0_0_20px_rgba(234,88,12,0.05)]' : 'border-white/5 bg-zinc-900/40'}`}
                    >
                        <div className={`p-4 rounded-2xl ${audioFile ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-zinc-800 text-zinc-500'}`}>
                            {isProcessingAudio ? <Activity className="animate-pulse" size={20} /> : <Music size={20} />}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="text-[11px] font-black truncate uppercase italic tracking-wider">
                                {isProcessingAudio ? "Analyzing Audio..." : audioFile ? audioFile.name : "Select Audio File"}
                            </h3>
                            {duration > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-orange-500 font-black italic">
                                        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                                    </span>
                                    <div className="h-1 w-1 bg-zinc-700 rounded-full" />
                                    <span className="text-[9px] text-zinc-500 font-bold">READY</span>
                                </div>
                            )}
                        </div>
                        {audioFile && !isProcessingAudio && <CheckCircle2 className="text-orange-600" size={20} />}
                        {isProcessingAudio && <Loader2 className="animate-spin text-orange-600" size={20} />}
                        <input type="file" ref={audioInputRef} onChange={handleAudioChange} accept="audio/*" className="hidden" />
                    </div>
                </div>

                {/* FIELDS */}
                <div className="space-y-5 bg-zinc-900/30 p-6 rounded-[3rem] border border-white/5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-2 italic">Song Title</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-zinc-900/80 border border-white/5 outline-none p-5 rounded-2xl font-black text-sm text-white focus:border-orange-600/40 transition-all uppercase italic"
                        />
                    </div>

                    {!isAddingToAlbum && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-2 italic">Genre</label>
                            <div className="relative">
                                <select
                                    value={formData.genre}
                                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                    className="w-full bg-zinc-900/80 border border-white/5 outline-none p-5 rounded-2xl font-black text-xs text-white appearance-none cursor-pointer uppercase italic"
                                >
                                    <option value="Konpa">Konpa</option>
                                    <option value="Raboday">Raboday</option>
                                    <option value="Rap Kreyol">Rap Kreyòl</option>
                                    <option value="Afrobeats">Afrobeats</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <Upload size={14} className="rotate-180" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={combinedUploading || isProcessingAudio}
                    className="w-full bg-orange-600 text-white font-black py-6 rounded-[2rem] uppercase tracking-[0.3em] text-[11px] disabled:opacity-30 shadow-2xl shadow-orange-600/20 italic"
                >
                    {combinedUploading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        isAddingToAlbum ? "Add to Album" : "Publish Single"
                    )}
                </motion.button>
            </form>
        </div>
    );
};

export default AddMusicMobile;