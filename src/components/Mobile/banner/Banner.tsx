import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ArtistBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        const closedDate = localStorage.getItem("artistBannerClosedAt");

        if (!closedDate) {
            setIsVisible(true);
        } else {
            
            const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
            const now = new Date().getTime();
            const timePassed = now - parseInt(closedDate);

            if (timePassed > threeDaysInMs) {
                setIsVisible(true);
                localStorage.removeItem("artistBannerClosedAt");
            }
        }
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);

        
        const now = new Date().getTime().toString();
        localStorage.setItem("artistBannerClosedAt", now);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className=" py-4 overflow-hidden"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5">
                        {}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        {}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/15 to-transparent z-0" />

                        <div className="relative z-10 flex items-center justify-between p-6 gap-6">

                            {}
                            <div className="flex-1 text-left">
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold mb-3 uppercase tracking-widest">
                                    <Mic2 size={12} />
                                    Kreyatè
                                </div>

                                <h2 className="text-xl md:text-3xl font-black text-white mb-1 leading-tight">
                                    VLE VIN <span className="text-orange-500 italic">ATIS?</span>
                                </h2>

                                <p className="text-zinc-400 text-xs md:text-sm mb-4 max-w-[180px] md:max-w-xs leading-relaxed">
                                    Pibliye mizik ou yo epi kite AI nou an jwenn odyans ou.
                                </p>

                                <h4 onClick={()=>{navigate(`/devniAtis`)}} className=" group flex items-center gap-2  text-white  py-2 rounded-xl text-[11px] font-bold transition-all  ">
                                    Kòmanse jodi a
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </h4>
                            </div>

                            {}
                            <div className="relative w-24 h-24 md:w-36 md:h-36 flex-none">
                                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 rotate-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500&auto=format&fit=crop"
                                        alt="Artist Studio"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                                {}
                                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-orange-500/20 blur-3xl rounded-full -z-10" />
                            </div>

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}