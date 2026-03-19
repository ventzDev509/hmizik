import { CheckCircle2, Download, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDownload } from "../../../context/DownloadContext";

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
    // Nou rale tout sa nou bezwen nan Context la
    const { activeDownloads, downloadTrack, cancelDownload, isOffline } = useDownload();
    
    // Tcheke si track sa a egzakteman ap telechaje nan Context la
    const downloadInfo = activeDownloads[trackId];
    const isDownloading = !!downloadInfo;
    const progress = downloadInfo?.progress || 0;

    const [isAlreadyOffline, setIsAlreadyOffline] = useState(false);

    // Tcheke estati offline la
    useEffect(() => {
        let isMounted = true;
        
        const check = async () => {
            if (!audioUrl) return;
            const result = await isOffline(audioUrl);
            if (isMounted) {
                setIsAlreadyOffline(result);
            }
        };

        check();
        return () => { isMounted = false; };
    }, [audioUrl, isOffline, isDownloading]); // Li re-tcheke lè isDownloading chanje (lè l fini)

    const handleAction = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isDownloading) {
            // SI L AP TELECHAJE: Nou anile li
            cancelDownload(trackId);
            return;
        }

        if (!isAlreadyOffline) {
            // SI L PA OFFLINE: Nou kòmanse telechajman an
            downloadTrack(trackId, audioUrl, coverUrl, title);
        }
    };

    return (
        <button
            onClick={handleAction}
            className={`relative flex items-center justify-center min-w-[40px] h-10 rounded-full bg-white/5 transition-all active:scale-95 group ${className}`}
        >
            {/* 1. Progress Ring (SVG) - Parèt sèlman si l ap telechaje */}
            {isDownloading && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="20" cy="20" r="18"
                        stroke="currentColor" strokeWidth="2" fill="transparent"
                        className="text-white/10"
                    />
                    <circle
                        cx="20" cy="20" r="18"
                        stroke="currentColor" strokeWidth="2" fill="transparent"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (progress / 100) * 113}
                        strokeLinecap="round"
                        className="text-orange-500 transition-all duration-300"
                    />
                </svg>
            )}

            <div className="relative z-10 flex items-center gap-2 px-2">
                {isDownloading ? (
                    // Lè l ap telechaje: Montre % oswa X pou anile lè w hover
                    <div className="flex items-center justify-center">
                        <span className="text-[10px] font-black text-orange-500 group-hover:hidden">
                            {progress}%
                        </span>
                        <XCircle size={18} className="text-red-500 hidden group-hover:block transition-colors" />
                    </div>
                ) : isAlreadyOffline ? (
                    // Lè l fini
                    <CheckCircle2 size={18} className="text-green-500 fill-green-500/10" />
                ) : (
                    // Estati nòmal
                    <Download size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
                )}

                {showText && !isDownloading && (
                    <span className="font-black text-xs uppercase tracking-tighter italic">
                        {isAlreadyOffline ? "Sove" : "Offline"}
                    </span>
                )}
            </div>
        </button>
    );
};

export default DownloadButton;