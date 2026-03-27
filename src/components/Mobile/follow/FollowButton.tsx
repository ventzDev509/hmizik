import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, UserPlus, UserCheck } from 'lucide-react';
import { useFollow } from '../../../context/FollowContext';

interface FollowButtonProps {
    artistId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ artistId }) => {
    const { toggleFollow, isFollowing, loadingIds } = useFollow();

    const active = isFollowing(artistId);
    const isLoading = loadingIds.includes(artistId);

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
                e.stopPropagation();
                toggleFollow(artistId);
            }}
            disabled={isLoading}
            style={{ border: "1px", borderColor: "#71717b " }}
            className={`
                
                relative flex items-center justify-center gap-2 px-6 py-1.5
                rounded-full font-bold text-[12px] tracking-tight
                transition-all duration-200 min-w-[140px] 
                border-zinc-500
                ${active
                    ? 'bg-transparent text-white border-zinc-500 hover:border-white'
                    : 'bg-transparent text-white border-zinc-500 hover:border-white'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Loader2 size={16} className="animate-spin" />
                    </motion.div>
                ) : (
                    <motion.div
                        key={active ? 'following' : 'follow'}
                        style={{ border: "1px", borderColor: "#71717b " }}
                        className="flex items-center gap-2"
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {active ? (
                            <>
                                <UserCheck size={16} strokeWidth={2.5} />
                                <span>Abòne deja</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} strokeWidth={2.5} />
                                <span>Abòne</span>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default FollowButton;