// import { useSelector } from "react-redux";
import Sidebar from "../menu/LeftMenu";
import BottomPlayer from "../Player/BottomPlayer";
// import type { RootState } from "../../store/store";
import Navbar from "../menu/NavBar";
import { useState } from "react";
import RightPanel from "../cards/RightPanel";
import { motion } from "framer-motion";

import { Music, TRACKS } from "../../data/data";
import { useImageColors } from "../utils/GetColor";

import im from "../../assets/OIF.webp"
import { useAudio } from "../../provider/PlayerContext";
import TablePlayListe from "../playList/TableListe";
import banner from "../../assets/banner.jpg"


const PLAYLIST = {
    title: "KING STREET Mix",
    subtitle: "Baky, Teddy Hashtag and TROUBLEBOY HITMAKER",
    description: "About recommendations and the impact of promotion",
    provider: "MHaiti",
    totalSongs: TRACKS.length,
    totalDuration: "about 2 hr 30 min",
    cover: im
};



export default function ArtistePage() {
    //   const colors = useSelector((state: RootState) => state.theme.colors);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

    const { bgColor, textColor, imgRef } = useImageColors(PLAYLIST?.cover);

    const { currentSong } = useAudio();
    return (
        <div className="flex w-full h-screen p-1.5 gap-2 relative bg-black">
            {/* Sidebar */}
            <div className="w-[250px] mr-12">
                <Sidebar />
            </div>

            {/* Main */}
            <motion.div
                style={{ backgroundColor: bgColor, color: textColor }}
                className="bg-gradient-to-b p-0 pb-26 from-gray-900 to-black rounded-xl overflow-y-scroll h-[100vh] relative"
                animate={{
                    width: selectedMusic ? "calc(100% - 250px - 320px)" : "calc(100% - 250px)",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >

                {/* Navbar fixé */}
                <div className={`sticky top-0 z-20 bg-gray-900`}>
                    <Navbar bgColor={bgColor} />
                </div>



                <div className=" bg-neutral-900 ">
                    {/* Header gradient */}
                    <header
                        className="w-full  relative"
                        style={{
                            background: `linear-gradient(180deg, ${bgColor} 0px, rgba(0,0,0,0.8) 400px)`,
                            color: textColor,
                        }}
                    >
                        <img ref={imgRef} src={banner} alt="" className="w-full   absolute h-[100%] object-cover" />
                        <div
                            className="absolute inset-0 blur-4xl opacity-60 bg-gradient-to-b from-gray-900 to-black"
                            style={{
                                backgroundImage: currentSong?.coverUrl,
                                backgroundColor: bgColor,
                            }}

                        >

                        </div>

                        <div className="max-w-7xl mx-auto px-6 h-[22em] pt-12 pb-12 z-10 relative">
                            <div className="flex gap-8 items-end">
                                {/* Cover */}
                                <div className="w-50 h-50 absolute top-56 rounded-full   overflow-hidden shadow-xl flex-shrink-0">
                                    <img  src={currentSong?.coverUrl} alt={PLAYLIST.title} className="w-full h-full object-cover" />
                                </div>
                                <div style={{ visibility: "hidden" }} className="w-50 h-50 mr-10  top-60 rounded-full   overflow-hidden shadow-xl flex-shrink-0">
                                    <img  src={currentSong?.coverUrl} alt={PLAYLIST.title} className="w-full h-full object-cover" />
                                </div>

                                {/* Title & meta */}
                                <div className="flex-1">
                                    <p style={{ color: textColor }} className="text-sm uppercase text-white/70 mb-2">Public Playlist</p>
                                    <h1 className="font-extrabold text-6xl leading-tight tracking-tight mb-4">{PLAYLIST.title}</h1>

                                    <p
                                        style={{ color: textColor }}
                                        className="text-white/80 mb-3">{PLAYLIST.subtitle}</p>


                                    <p style={{ color: textColor }} className="text-sm text-white/60 mt-4 max-w-xl">{PLAYLIST.description}</p>

                                    {/* Controls */}
                                    <div className="flex items-center gap-4 mt-8 text-white">
                                        <div className=" cursor-pointer flex items-center  gap-3 bg-green-500 hover:bg-green-400  px-4 py-3 rounded-full text-lg font-semibold shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3v18l16-9L4 3z" /></svg>
                                            Play
                                        </div>

                                        <div className=" cursor-pointer w-10 h-10 rounded-full bg-neutral-800/60 flex items-center justify-center hover:bg-neutral-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                                        </div>

                                        <div className=" cursor-pointer w-10 h-10 rounded-full bg-neutral-800/60 flex items-center justify-center hover:bg-neutral-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content area */}
                    <main className="max-w-7xl mx-auto px-6 pt-18 pb-8">
                        <TablePlayListe />
                    </main>
                </div>



            </motion.div>

            {/* Right Panel (détails artiste) */}
            <RightPanel music={selectedMusic} onClose={() => setSelectedMusic(null)} />

            {/* Player en bas */}
            <BottomPlayer />
        </div>
    );
}
