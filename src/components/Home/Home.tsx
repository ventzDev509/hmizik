// import { useSelector } from "react-redux";
import Sidebar from "../menu/LeftMenu";
import BottomPlayer from "../Player/BottomPlayer";
// import type { RootState } from "../../store/store";
import Navbar from "../menu/NavBar";
import Card from "../cards/Card";
import CardRadio from "../cards/RadioCard";
import { useState } from "react";
import RightPanel from "../cards/RightPanel";
import { motion } from "framer-motion";

// Import des données statiques
import { playlists, radios, Music } from "../../data/data";
import { useAudio } from "../../provider/PlayerContext";
import { useImageColors } from "../utils/GetColor";

export default function Home() {
    //   const colors = useSelector((state: RootState) => state.theme.colors);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const { currentSong, } = useAudio();
    const { bgColor, textColor } = useImageColors(currentSong?.cover);
    return (
        <div className="flex w-full h-screen p-1.5 gap-2 relative bg-black">
            {/* Sidebar */}
            <div className="w-[250px] mr-12">
                <Sidebar />
            </div>

            {/* Main */}
            <motion.div
                style={{ backgroundColor: bgColor, color: textColor }}
                className="bg-gradient-to-b p-0 pb-30 from-gray-900 to-black rounded-xl overflow-y-scroll h-[100vh] relative"
                animate={{
                    width: selectedMusic ? "calc(100% - 250px - 320px)" : "calc(100% - 250px)",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >

                {/* Navbar fixé */}
                <div className={`sticky top-0 z-20 bg-gray-900`}>
                    <Navbar />
                </div>
              
                {/* Playlists */}
                <div className="mt-6">
                    <div className="pl-8 mb-4">
                        <h2 className="text-xl font-bold text-white">Playlists</h2>
                    </div>
                    <div className="flex pl-8 gap-4 overflow-x-auto pb-4 pr-6 scrollbar-hide">
                        {playlists.map((pl: any) => (
                            <div
                                key={pl.id}
                                className="flex-shrink-0 w-40"
                            // onClick={() => setSelectedMusic(pl)}
                            >
                                <Card id={pl?.id} image={pl.cover} title={pl.title} subtitle={pl.artist} song={pl} setSelect={setSelectedMusic} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Radios */}
                <div className="mt-5">
                    <div className="pl-8 mb-5">
                        <h2 className="text-xl font-bold text-white">Radios</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pl-8 scrollbar-hide">
                        {radios.map((r: any) => (
                            <div key={r.id} onClick={() => setSelectedMusic(r)}>
                                <CardRadio image={r.cover} title={r.title} subtitle={r.artist} />
                            </div>
                        ))}
                    </div>
                </div>


                <div className="mt-6">
                    <div className="pl-8 mb-4">
                        <h2 className="text-xl font-bold text-white">Playlists</h2>
                    </div>
                    <div className="flex pl-8 gap-4 overflow-x-auto pb-4 pr-6 scrollbar-hide">
                        {playlists.map((pl: any) => (
                            <div
                                key={pl.id}
                                className="flex-shrink-0 w-40"
                            // onClick={() => setSelectedMusic(pl)}
                            >
                                <Card id={pl?.id} image={pl.cover} title={pl.title} subtitle={pl.artist} song={pl} setSelect={setSelectedMusic} />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right Panel (détails artiste) */}
            <RightPanel music={selectedMusic} onClose={() => setSelectedMusic(null)} />

            {/* Player en bas */}
            <BottomPlayer />
        </div>
    );
}
