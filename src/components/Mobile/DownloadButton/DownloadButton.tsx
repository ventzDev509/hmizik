import { X, Download, CheckCircle2 } from "lucide-react";
import { useDownloads } from "../../../context/DownloadContext";
import { useEffect, useState } from "react";
import { useOfflineDownload } from "../hooks/useOfflineDownload";

const DownloadButton = ({ audioUrl, coverUrl, title, trackId }: any) => {
    const { activeDownloads, startDownload, cancelDownload } = useDownloads();
    const { isOffline } = useOfflineDownload();
    const [isSaved, setIsSaved] = useState(false);
    
    const currentTask = activeDownloads[trackId];
    const isDownloading = !!currentTask;

    // Tcheke si track la deja offline depi nan kòmansman
    useEffect(() => {
        const checkCach = async () => {
            const saved = await isOffline(audioUrl);
            setIsSaved(saved);
        };
        checkCach();
    }, [audioUrl, isOffline, isDownloading]); // Re-tcheke lè download la fini

    const handleAction = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isDownloading) {
            // Lojik pou CANCEL
            cancelDownload(trackId);
        } else if (!isSaved) {
            // Lojik pou START
            startDownload({ id: trackId, audioUrl, coverUrl, title });
        }
    };

    // Kalkil pou Sèk Progress la
    const radius = 16;
    const circumference = 2 * Math.PI * radius; // ~100.5

    return (
        <button 
            onClick={handleAction} 
            className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-90"
        >
            {isDownloading ? (
                <div className="relative flex items-center justify-center">
                    {/* Progress Ring Background */}
                    <svg className="absolute w-9 h-9 -rotate-90">
                        <circle
                            cx="18" cy="18"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="transparent"
                            className="text-white/10"
                        />
                        {/* Progress k ap avanse a */}
                        <circle
                            cx="18" cy="18"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - (currentTask.progress / 100) * circumference}
                            strokeLinecap="round"
                            className="text-orange-500 transition-all duration-300 ease-out"
                        />
                    </svg>
                    
                    {/* Ikòn X pou anile a parèt nan mitan */}
                    <X size={14} className="text-orange-500 z-10 animate-in fade-in zoom-in duration-200" />
                    
                    {/* Ti pousantaj la anba (opsyonèl) */}
                    <span className="absolute -bottom-6 text-[8px] font-bold text-orange-500">
                        {currentTask.progress}%
                    </span>
                </div>
            ) : isSaved ? (
                <div className="animate-in zoom-in duration-300">
                    <CheckCircle2 size={20} className="text-green-500 fill-green-500/10" />
                </div>
            ) : (
                <Download 
                    size={18} 
                    className="text-zinc-400 group-hover:text-white transition-colors" 
                />
            )}
        </button>
    );
};

export default DownloadButton;