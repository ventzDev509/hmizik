import React, { useRef, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

interface AlbumHeaderProps {
    album: any;
    isEditMode: boolean;
    editedTitle: string;
    setEditedTitle: (val: string) => void;
    previewUrl: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imgRef: React.RefObject<HTMLImageElement | null>;
    imgOpacity: any; 
    imgScale: any;
    bgColor: string; 
}

const AlbumHeader: React.FC<AlbumHeaderProps> = ({
    album, isEditMode, editedTitle, setEditedTitle, 
    previewUrl, onFileChange, imgRef, imgOpacity, imgScale,
    bgColor 
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    
    useEffect(() => {
        if (bgColor) {
            
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            
            if (!metaThemeColor) {
                
                metaThemeColor = document.createElement('meta');
                metaThemeColor.setAttribute('name', 'theme-color');
                document.head.appendChild(metaThemeColor);
            }
            
            
            metaThemeColor.setAttribute('content', bgColor);
        }

        
        return () => {
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', '#121212'); 
            }
        };
    }, [bgColor]);

    return (
        <motion.div 
            style={{ opacity: imgOpacity, scale: imgScale }} 
            className="flex flex-col items-center px-6 pb-6 pt-6 text-center"
        >
            {}
            <div className="w-56 h-56 mb-8 shadow-2xl relative group">
                <img 
                    ref={imgRef} 
                    src={previewUrl || album?.coverUrl} 
                    alt={album?.title} 
                    className="w-full h-full object-cover rounded-md shadow-2xl transition-all duration-700" 
                />
                
                {isEditMode && (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-md cursor-pointer border-2 border-dashed border-orange-500/50 transition-all hover:bg-black/40"
                    >
                        <UploadCloud size={32} className="text-orange-500 mb-2" />
                        <span className="text-[10px] font-black uppercase italic text-white">Chanje Cover</span>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={onFileChange} 
                        />
                    </div>
                )}
            </div>
            
            {}
            <div className="w-full px-4">
                {isEditMode ? (
                    <input
                        autoFocus
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-3xl font-black mb-2 tracking-tighter uppercase italic bg-white/10 border-b-2 border-orange-600 outline-none w-full text-center p-2 rounded-t-lg text-white"
                        placeholder="Non Album nan"
                    />
                ) : (
                    <h3 className="text-4xl font-black mb-2 tracking-tighter uppercase italic leading-tight line-clamp-2">
                        {album?.title}
                    </h3>
                )}
                
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest italic">
                        {album?.artist?.username || 'Atis'} • {album?.tracks?.length || 0} Mizik
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default AlbumHeader;