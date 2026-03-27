import React, { useEffect, useState } from 'react';
import {
    ChevronLeft,
    Bell,
    UserPlus,
    Music2,
    Circle
} from 'lucide-react';
import { motion } from 'framer-motion';
import BottomMenu from '../menu/BottomMenu';
import api from '../../../api/axios';

// Ti fonksyon pou dat an Kreyòl
const formatKreyolDate = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Kounye a";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `sa gen ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `sa gen ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `sa gen ${days} jou`;
    return new Date(date).toLocaleDateString();
};

const NotificationPage: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // 1. Rekipere notifikasyon yo
                const response = await api.get('/notifications');
                setNotifications(response.data);

                // 2. Si gen notifikasyon ki poko li, nou make yo tout "Read" nan yon sèl kou
                const hasUnread = response.data.some((n: any) => !n.read);
                if (hasUnread) {
                    await api.post('/notifications/mark-read');

                    // Ti delay 2 segonn anvan nou retire pwen zoranj yo nan UI a pou itilizatè a wè sa k nèf yo
                    setTimeout(() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    }, 2000);
                }
            } catch (error) {
                console.error("Erè lè n ap chèche notifikasyon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen bg-[#121212] text-white pb-20">
            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-xl h-16 flex items-center justify-between px-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-white/5 rounded-full transition active:scale-90 cursor-pointer"
                    >
                        <ChevronLeft size={24} />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-orange-500">Notifications</h2>
                </div>
            </header>

            {/* LIST SECTION */}
            <div className="mt-4 px-2">
                {loading ? (
                    <div className="text-center p-10 opacity-50 font-medium text-sm">
                        Chaje notifikasyon...
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-500 mb-1 
                                ${!notif.read ? 'bg-orange-500/[0.03] border border-orange-500/10' : 'hover:bg-white/[0.02]'}`}
                        >
                            {/* Ikon / Imaj Moun nan */}
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border border-white/5">
                                    {notif.sender?.profile?.avatar ? (
                                        <img
                                            src={notif.sender.profile.avatar}
                                            className="w-full h-full object-cover"
                                            alt="User"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                            <Bell size={20} />
                                        </div>
                                    )}
                                </div>

                                {/* Badge ki montre aksyon an */}
                                <div className={`absolute -right-1 -bottom-1 w-6 h-6 rounded-full border-2 border-[#121212] flex items-center justify-center
                                    ${notif.type === 'FOLLOW' ? 'bg-blue-500' : 'bg-orange-500'}`}
                                >
                                    {notif.type === 'FOLLOW' ? <UserPlus size={10} /> : <Music2 size={10} />}
                                </div>
                            </div>

                            {/* Kontni Tèks Dinamik */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm leading-tight text-zinc-300">
                                    <span className="font-bold text-white mr-1">
                                        {notif.sender?.profile?.displayName || notif.sender?.name || "Itilizatè H-Mizik"}
                                    </span>
                                    {notif.type === 'FOLLOW' && 'kòmanse swiv ou.'}
                                    {notif.type === 'LIKE_TRACK' && 'renmen yon mizik ou lage.'}
                                    {notif.type === 'LIKE_ALBUM' && 'renmen album ou a.'}
                                </p>
                                <span className="text-[10px] text-zinc-500 mt-1 block font-medium tracking-wide uppercase">
                                    {formatKreyolDate(notif.createdAt)}
                                </span>
                            </div>

                            {/* Pwen zoranj si notifikasyon an poko li */}
                            {!notif.read && (
                                <motion.div
                                    layoutId={`dot-${notif.id}`}
                                    className="flex-shrink-0 ml-2"
                                >
                                    <Circle size={8} fill="#f97316" className="text-orange-500 animate-pulse" />
                                </motion.div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="mt-20 px-10 text-center opacity-20">
                        <Bell size={48} className="mx-auto mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">Pa gen notifikasyon pou kounye a</p>
                    </div>
                )}
            </div>

            <BottomMenu />
        </div>
    );
};

export default NotificationPage;