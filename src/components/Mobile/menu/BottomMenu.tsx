import React, { useState } from 'react';
import { Home, Search, Library, Music2 } from 'lucide-react';
import BottomMPlayerMobile from './BottomPlayerMobile';
import { useNavigate } from 'react-router-dom';

type Tab = 'home' | 'search' | 'library' | 'premium';

const BottomMenu: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const navigate = useNavigate();

    return (
        <div className="w-full text-white font-sans">
            {/* --- ZÒN KI FIKSE ANBA A --- */}
            <div className="fixed bottom-0 left-0 right-0 z-[100]">

                {/* 2. MINI PLAYER */}
                <div>
                    <BottomMPlayerMobile />
                </div>

                {/* 3. CLASSIC BOTTOM MENU */}
                {/* Chanjman isit la: 
                   - Nou itilize `pb-[env(...)]` pou sistèm nan ajoute espas si gen bar navigasyon.
                   - Nou mete yon background nwa solid pou kouvri tout zòn anba a nèt.
                */}
                <nav
                    className="bg-[#121212] border-t border-white/10 pt-4 px-2"
                    style={{
                        /* Sa ap pouse bouton yo moute yon ti kras pou yo pa sou tèt liy jès la */
                        paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)'
                    }}
                >
                    <div className="flex justify-center items-center max-w-lg gap-16 mx-auto">
                        <NavItem
                            label="Home" icon={Home}
                            active={activeTab === 'home'}
                            onClick={() => {
                                setActiveTab('home');
                                navigate("/");
                            }}
                        />
                        <NavItem
                            label="Search" icon={Search}
                            active={activeTab === 'search'}
                            onClick={() => {
                                setActiveTab('search');
                                navigate("/search");
                            }}
                        />
                        <NavItem
                            label="Library" icon={Library}
                            active={activeTab === 'library'}
                            onClick={() => {
                                setActiveTab('library');
                                navigate("/library");
                            }}
                        />
                        <NavItem
                            label="Premium" icon={Music2}
                            active={activeTab === 'premium'}
                            onClick={() => {
                                setActiveTab('premium');
                                navigate("/auth");
                            }}
                        />
                    </div>
                </nav>
            </div>
        </div>
    );
};

const NavItem = ({ label, icon: Icon, active, onClick }: any) => (
    <div
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-1.5 transition-all duration-300 active:opacity-60 cursor-pointer"
    >
        <Icon
            className={`w-6 h-6 transition-all duration-300 ${active ? 'text-white fill-white scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
            strokeWidth={active ? 2.5 : 2}
        />
        <span className={`text-[10px] tracking-tight transition-colors duration-300 ${active ? 'text-white font-bold' : 'text-zinc-500 font-medium'}`}>
            {label}
        </span>
    </div>
);

export default BottomMenu;