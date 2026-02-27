import React from 'react';
import {
    ChevronLeft,
    Bell,
    Heart,
    UserPlus,
    Music2,
    MoreHorizontal,
    Circle
} from 'lucide-react';
import { motion } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';

// Tipizasyon pou notifikasyon yo
interface NotificationItem {
    id: string;
    type: 'follow' | 'like' | 'new_release' | 'system';
    user?: string;
    content: string;
    time: string;
    img?: string;
    isUnread: boolean;
}

const notifications: NotificationItem[] = [
    {
        id: '1',
        type: 'new_release',
        content: "Bèl Mizik te lage yon nouvo single: 'Lavi dous'",
        time: '2h ago',
        img: 'https://picsum.photos/seed/music1/100',
        isUnread: true
    },
    {
        id: '2',
        type: 'follow',
        user: 'Jean-Baptiste',
        content: "kòmanse swiv ou.",
        time: '5h ago',
        img: 'https://picsum.photos/seed/user1/100',
        isUnread: true
    },
    {
        id: '3',
        type: 'like',
        user: 'Dj Mix',
        content: "renmen playlist 'Rabòday Vibe' ou a.",
        time: '1d ago',
        img: 'https://picsum.photos/seed/user2/100',
        isUnread: false
    },
    {
        id: '4',
        type: 'system',
        content: "Byenvini sou H-Mizik! Kòmanse eksplore pi bèl vibe ayisyen yo.",
        time: '2d ago',
        isUnread: false
    },
];

const NotificationPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#121212] text-white pb-20">
            {/* 1. HEADER */}
            <header className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-xl h-16 flex items-center justify-between px-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-2 hover:bg-white/5 rounded-full transition active:scale-90">
                        <ChevronLeft size={24} />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-widest">Notifications</h2>
                </div>
                
            </header>

            {/* 2. LIST SECTION */}
            <div className="mt-4 px-2">
                {notifications.map((notif, index) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                        className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors ${notif.isUnread ? 'bg-white/[0.02]' : ''}`}
                    >
                        {/* Ikon oswa Imaj */}
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                                {notif.img ? (
                                    <img src={notif.img} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-orange-500">
                                        <Bell size={20} />
                                    </div>
                                )}
                            </div>
                            {/* Ti Ikon ki montre tip la */}
                            <div className={`absolute -right-1 -bottom-1 w-6 h-6 rounded-full border-2 border-[#121212] flex items-center justify-center
                                ${notif.type === 'like' ? 'bg-red-500' :
                                    notif.type === 'follow' ? 'bg-blue-500' :
                                        notif.type === 'new_release' ? 'bg-orange-500' : 'bg-zinc-600'}`}
                            >
                                {notif.type === 'like' && <Heart size={10} fill="white" />}
                                {notif.type === 'follow' && <UserPlus size={10} />}
                                {notif.type === 'new_release' && <Music2 size={10} />}
                                {notif.type === 'system' && <Bell size={10} />}
                            </div>
                        </div>

                        {/* Kontni Tèks */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm leading-tight text-zinc-300">
                                {notif.user && <span className="font-bold text-white mr-1">{notif.user}</span>}
                                {notif.content}
                            </p>
                            <span className="text-[10px] text-zinc-500 mt-1 block font-medium tracking-wide uppercase">
                                {notif.time}
                            </span>
                        </div>

                        {/* Endikatè ki pa li (Blue Dot) */}
                        {notif.isUnread && (
                            <div className="flex-shrink-0">
                                <Circle size={8} fill="#f97316" className="text-orange-500" />
                            </div>
                        )}

                        <div className="p-2 text-zinc-600 hover:text-white">
                            <MoreHorizontal size={18} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* empty state message (opsyonèl) */}
            <div className="mt-12 px-10 text-center opacity-20">
                <Bell size={40} className="mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">No more notifications</p>
            </div>
            <BottomMenu/>
        </div>
    );
};

export default NotificationPage;