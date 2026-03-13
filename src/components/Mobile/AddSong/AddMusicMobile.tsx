import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Upload, Image as ImageIcon, X, Loader2, CheckCircle2, Info } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useTracks } from '../../../context/TrackContext';

const AddMusicMobile: React.FC = () => {
    const { uploadTrack, uploading: isUploading } = useTracks();

    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        genre: 'Konpa',
        description: '',
        isPublic: true
    });

    const audioInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const getAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                resolve(Math.round(audio.duration));
                URL.revokeObjectURL(audio.src);
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
                    setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
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

        const data = new FormData();
        data.append('title', formData.title);
        data.append('genre', formData.genre);
        data.append('duration', duration.toString());
        data.append('audio', audioFile);

        if (coverFile) {
            data.append('cover', coverFile);
        }

        try {
            await uploadTrack(data);
            setAudioFile(null);
            setCoverFile(null);
            setCoverPreview(null);
            setFormData({ title: '', genre: 'Konpa', description: '', isPublic: true });
        } catch (error) {
            // Jere nan Provider
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans pb-32">
            <Toaster position="top-center" />

            {/* --- OVERLAY UPLOAD PROGRESS (Koulè Orange) --- */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center px-10"
                    >
                        <div className="w-full max-w-xs space-y-6 text-center">
                            <div className="relative inline-block">
                                <Loader2 className="animate-spin text-orange-600" size={50} />
                                <div className="absolute inset-0 blur-2xl bg-orange-600/30 animate-pulse"></div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-black uppercase tracking-widest">Ap Pibliye...</h2>
                                <p className="text-zinc-400 text-sm italic">H-MIZIK ap prepare son ou a</p>
                            </div>

                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-orange-600"
                                    initial={{ width: "10%" }}
                                    animate={{ width: "98%" }}
                                    transition={{ duration: 12, ease: "linear" }}
                                />
                            </div>
                            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter italic">Pa fèmen oswa kache aplikasyon an</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 sticky top-0 bg-[#121212]/95 backdrop-blur-md z-40">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">Ajoute yon Mizik</h2>
                <div onClick={() => window.history.back()} className="p-2 bg-zinc-900 rounded-lg cursor-pointer">
                    <X className="text-zinc-400" size={18} />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8 max-w-md mx-auto">

                {/* COVER SECTION */}
                <div className="flex flex-col items-center">
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => coverInputRef.current?.click()}
                        className="relative w-64 h-64 bg-zinc-900 rounded-3xl shadow-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-white/5 group cursor-pointer"
                    >
                        {coverPreview ? (
                            <img src={coverPreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <div className="flex flex-col items-center p-6 text-center">
                                <div className="p-4 bg-orange-600/10 rounded-full mb-4">
                                    <ImageIcon size={32} className="text-orange-600" />
                                </div>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Foto Kouvèti (Cover)</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                            <Upload size={24} className="text-white" />
                        </div>
                    </motion.div>
                    <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                </div>

                {/* AUDIO SELECTOR (Orange Theme) */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Fichye Son (MP3, WAV)</label>
                    <div
                        onClick={() => audioInputRef.current?.click()}
                        className={`w-full p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex items-center gap-4 ${audioFile ? 'border-orange-600 bg-orange-600/5 shadow-lg shadow-orange-600/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}
                    >
                        <div className={`p-3 rounded-xl ${audioFile ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                            <Music size={22} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="text-sm font-black truncate">
                                {audioFile ? audioFile.name : "Chwazi mizik la"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter">
                                    {audioFile ? `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB` : "Audio file"}
                                </span>
                                {duration > 0 && (
                                    <span className="text-[9px] bg-orange-600/20 text-orange-500 px-2 py-0.5 rounded-md font-mono font-bold">
                                        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        </div>
                        {audioFile && <CheckCircle2 className="text-orange-600" size={20} />}
                        <input type="file" ref={audioInputRef} onChange={handleAudioChange} accept="audio/*" className="hidden" />
                    </div>
                </div>

                {/* INPUTS SECTION */}
                <div className="space-y-5 bg-zinc-900/30 p-5 rounded-[2.5rem] border border-white/5 shadow-inner">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Tit Mizik la</label>
                        <input
                            type="text"
                            required
                            placeholder="Ekri tit son an..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/5 focus:border-orange-600/50 outline-none p-4 rounded-2xl font-bold text-white transition-all placeholder:text-zinc-700 shadow-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Stil</label>
                            <select
                                value={formData.genre}
                                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                className="w-full bg-zinc-900 border border-white/5 outline-none p-4 rounded-2xl font-bold text-white appearance-none cursor-pointer focus:border-orange-600/50"
                            >
                                <option value="Konpa">Konpa</option>
                                <option value="Raboday">Raboday</option>
                                <option value="Rap Kreyol">Rap Kreyòl</option>
                                <option value="Afrobeats">Afrobeats</option>
                                <option value="Dancehall">Dancehall</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Vizibilite</label>
                            <div
                                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                                className="w-full bg-zinc-900 p-4 rounded-2xl font-bold text-white flex items-center justify-between cursor-pointer border border-white/5"
                            >
                                <span className="text-[10px] uppercase font-black">{formData.isPublic ? 'Piblik' : 'Prive'}</span>
                                <div className={`w-3 h-3 rounded-full ${formData.isPublic ? 'bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.6)]' : 'bg-zinc-700'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-3 bg-orange-600/5 p-4 rounded-2xl border border-orange-600/10">
                    <Info size={16} className="text-orange-600 mt-1 flex-shrink-0" />
                    <p className="text-[9px] text-zinc-500 leading-relaxed font-medium">
                        Lè w pibliye sou <span className="text-orange-600 font-bold">H-MIZIK</span>, ou konfime ke ou gen dwa legal sou travay sa a. Nenpòt vòlè dwa otè ka lakòz kont ou fèmen.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{backgroundColor:"oklch(64.6% 0.222 41.116)"}}
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5  rounded-2xl shadow-2xl shadow-orange-600/10 uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-50"
                >
                    {isUploading ? "N ap uploade son an..." : "Pibliye Mizik la"}
                </motion.button>

            </form>
        </div>
    );
};

export default AddMusicMobile;