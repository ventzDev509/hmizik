import { CheckCircle2, Download } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOfflineDownload } from "../hooks/useOfflineDownload";

interface DownloadButtonProps {
    audioUrl: string;
    coverUrl: string;
    title: string;
    trackId: string;
    className?: string;
    showText?: boolean;
}

const DownloadButton = ({ 
    audioUrl, 
    coverUrl, 
    title, 
    trackId, 
    className = "", 
    showText = false 
}: DownloadButtonProps) => {
    const { downloadWithProgress, isOffline } = useOfflineDownload();
    const [status, setStatus] = useState<'idle' | 'loading' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const checkStatus = async () => {
            const offline = await isOffline(audioUrl);
            if (offline) setStatus('completed');
        };
        checkStatus();
    }, [audioUrl, isOffline]);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (status !== 'idle') return;

        setStatus('loading');
        setProgress(0);

        try {
            // Nou pase tout paramèt yo, enkli trackId
            await downloadWithProgress(audioUrl, coverUrl, title, trackId, (p) => setProgress(p));

            setStatus('completed');
            toast.success(`${title} sove offline!`);
        } catch (error) {
            console.error("Download error:", error);
            setStatus('idle');
            toast.error("Telechajman an echwe.");
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={status === 'loading'}
            className={`relative flex items-center justify-center min-w-[40px] h-10 rounded-full bg-white/5 transition-all active:scale-95 ${className}`}
        >
            {/* Rond Progress la (SVG) */}
            {status === 'loading' && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="20" cy="20" r="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-white/10"
                    />
                    <circle
                        cx="20" cy="20" r="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (progress / 100) * 113}
                        strokeLinecap="round"
                        className="text-orange-500 transition-all duration-300"
                    />
                </svg>
            )}

            <div className="relative z-10 flex items-center gap-2 px-2">
                {status === 'loading' ? (
                    <span className="text-[10px] font-black text-orange-500">{progress}%</span>
                ) : status === 'completed' ? (
                    <CheckCircle2 size={18} className="text-green-500 fill-green-500/10" />
                ) : (
                    <Download size={18} className="text-zinc-400 hover:text-white transition-colors" />
                )}

                {showText && status !== 'loading' && (
                    <span className="font-black text-xs uppercase tracking-tighter italic">
                        {status === 'completed' ? "Sove" : "Offline"}
                    </span>
                )}
            </div>
        </button>
    );
};

export default DownloadButton;