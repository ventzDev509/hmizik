import React, { useState } from 'react';
import {
    Home, Search, Library, Music2,

} from 'lucide-react';
import BottomMPlayerMobile from './BottomPlayerMobile';
import { useNavigate } from 'react-router-dom';

type Tab = 'home' | 'search' | 'library' | 'premium';

const BottomMenu: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const  navigate  = useNavigate()
    return (
        <div className=" w-full text-white font-sans">


            {/* --- ZÒN KI FIKSE ANBA A --- */}
            <div className="fixed bottom-0 left-0 right-0 z-[100]">

                {/* 2. MINI PLAYER (Floating & Compact) */}
                <div className="">
                    <BottomMPlayerMobile />

                </div>

                {/* 3. CLASSIC BOTTOM MENU (Glas Transparan san background dèyè ikon) */}
                <nav className="bg-black/90  border-t border-white/10 pt-4 pb-5 px-2">
                    <div className="flex justify-center items-center max-w-lg gap-16 mx-auto">
                        <NavItem
                            label="Home" icon={Home}
                            active={activeTab === 'home'}
                            onClick={() => {
                                setActiveTab('home')
                                navigate("/")
                            }
                            }
                        />
                        <NavItem
                            label="Search" icon={Search}
                            active={activeTab === 'search'}
                            onClick={() => {
                                setActiveTab('search')
                                navigate("/search")
                            }}
                        />
                        <NavItem
                            label="Library" icon={Library}
                            active={activeTab === 'library'}
                            onClick={() => {
                                setActiveTab('library')
                                navigate("/library")
                            }}
                        />
                        <NavItem
                            label="Premium" icon={Music2}
                            active={activeTab === 'premium'}
                            onClick={() => {setActiveTab('premium')
                                navigate("/auth")
                            }}
                        />
                    </div>
                </nav>
            </div>
        </div>
    );
};

// --- NavItem san okenn background, sèlman transparan ---
const NavItem = ({ label, icon: Icon, active, onClick }: any) => (
    <div
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-1.5 transition-all duration-300 active:opacity-60"
    >
        <Icon
            className={`w-6 h-6 transition-all duration-300 ${active ? 'text-white fill-white scale-110' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            strokeWidth={active ? 2.5 : 2}
        />
        <span className={`text-[10px] tracking-tight transition-colors duration-300 ${active ? 'text-white font-bold' : 'text-zinc-500 font-medium'
            }`}>
            {label}
        </span>
    </div>
);

export default BottomMenu;