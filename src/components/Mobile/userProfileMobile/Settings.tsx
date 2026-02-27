import React from 'react';
import { 
    ChevronLeft, User, Bell, ShieldCheck, 
    CloudOff, Info, LogOut, ChevronRight, 
    Globe, Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    danger?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, onClick, danger }) => (
    <motion.div 
        whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        onClick={onClick}
        className="flex items-center justify-between px-6 py-4 cursor-pointer border-b border-white/[0.03]"
    >
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${danger ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
                {icon}
            </div>
            <div>
                <h3 className={`text-sm font-bold ${danger ? 'text-red-500' : 'text-zinc-100'}`}>{title}</h3>
                {subtitle && <p className="text-[11px] text-zinc-500">{subtitle}</p>}
            </div>
        </div>
        <ChevronRight size={18} className="text-zinc-600" />
    </motion.div>
);

const SettingsPage: React.FC = () => {
    return (
        /* Animasyon Slide soti adwat */
        <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[500] bg-[#121212] text-white overflow-y-auto no-scrollbar"
        >
            {/* TOP NAVIGATION */}
            <div className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-xl h-16 flex items-center px-4 border-b border-white/5">
                <div className="p-2 hover:bg-white/5 rounded-full transition active:scale-90">
                    <ChevronLeft size={24} />
                </div>
                <h2 className="ml-4 text-lg font-black uppercase tracking-widest">Settings</h2>
            </div>

            <div className="mt-4 pb-20">
                {/* 1. ACCOUNT */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="px-6 py-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Account</h2>
                    </div>
                    <SettingItem icon={<User size={20}/>} title="Profile" subtitle="Manage your public profile information" />
                    <SettingItem icon={<Lock size={20}/>} title="Password & Security" subtitle="Update your password and login methods" />
                    <SettingItem icon={<Globe size={20}/>} title="Language" subtitle="Haitian Creole (Kreyòl)" />
                </motion.div>

                {/* 2. PREFERENCES */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="px-6 py-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Preferences</h2>
                    </div>
                    <SettingItem icon={<Bell size={20}/>} title="Notifications" subtitle="Push, Email, and SMS alerts" />
                    <SettingItem icon={<ShieldCheck size={20}/>} title="Privacy & Safety" subtitle="Who can see your activities" />
                    <SettingItem icon={<CloudOff size={20}/>} title="Offline Mode" subtitle="Manage your downloaded music" />
                </motion.div>

                {/* 3. MORE */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="px-6 py-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">More</h2>
                    </div>
                    <SettingItem icon={<Info size={20}/>} title="About H-Mizik" subtitle="Version 2.4.0 (2026)" />
                    <SettingItem icon={<LogOut size={20}/>} title="Logout" danger={true} />
                </motion.div>

                {/* VERSION FOOTER */}
                <div className="mt-12 text-center pb-10">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Made with ❤️ in Haiti</p>
                    <p className="text-[9px] text-zinc-700 mt-2 italic">© 2026 H-Mizik Inc.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsPage;