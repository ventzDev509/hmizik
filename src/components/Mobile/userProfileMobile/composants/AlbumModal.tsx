import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Calendar } from 'lucide-react';
import type { AlbumFormState } from '../../../types/Profile';

interface AlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    albumForm: AlbumFormState;
    setAlbumForm: (val: any) => void;
    onSubmit: () => void;
    isUploading: boolean;
    uploadProgress: number;
    error: string | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AlbumModal = ({ 
    isOpen, onClose, albumForm, setAlbumForm, onSubmit, 
    isUploading, uploadProgress, error, handleFileChange 
}: AlbumModalProps) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center">
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#18181b] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 relative border-t border-white/10 overflow-hidden">
                    {isUploading && (
                        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full rotate-[-90deg]"><circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" /><circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-orange-500" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100} strokeLinecap="round" /></svg>
                                <span className="absolute text-sm font-black">{uploadProgress}%</span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-4 animate-pulse">Kreyasyon...</p>
                        </div>
                    )}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black uppercase italic tracking-tighter text-orange-500">Nouvo Album</h2>
                        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                    </div>
                    <div className="space-y-6">
                        <label className="relative mx-auto w-44 h-44 bg-zinc-800 rounded-[2.5rem] overflow-hidden cursor-pointer border-2 border-dashed border-white/10 flex items-center justify-center shadow-2xl">
                            {albumForm.preview ? <img src={albumForm.preview} className="w-full h-full object-cover" alt="preview" /> : <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-orange-500"><Camera size={28} /><span className="text-[9px] font-black uppercase tracking-tighter">Chwazi Cover</span></div>}
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <div className="space-y-4">
                            <input type="text" placeholder="Tit Album" className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-orange-600 transition-all text-sm font-bold" value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} />
                            <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input type="datetime-local" className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-3xl outline-none focus:border-orange-600 transition-all text-sm font-bold text-zinc-300" onChange={(e) => setAlbumForm({ ...albumForm, releaseDate: e.target.value })} />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest animate-bounce">{error}</p>}
                        <button onClick={onSubmit} disabled={!albumForm.title || !albumForm.cover || isUploading} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-orange-700 transition-all disabled:opacity-50 shadow-xl active:scale-95">Kontinye kreyasyon an</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default AlbumModal;