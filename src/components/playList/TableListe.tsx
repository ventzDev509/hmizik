import { TRACKS } from "../../data/data";
import { useAudio } from "../../provider/PlayerContext";
import AudioBufferVisualizer from "../buffer/Buffer";
export default function TablePlayListe() {
    const { currentSong, playSong } = useAudio();
    return <>

        {/* Track list header (table headings) */}
        <div className="bg-neutral-900/40 rounded-t-md overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-3 text-sm text-white/60 border-b border-white/5">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Title</div>
                <div className="col-span-3">Album</div>
                <div className="col-span-1 text-right">Date added</div>
                <div className="col-span-1 text-right">⏱</div>
            </div>

            {/* Track rows */}
            <ul className="divide-y divide-white/3">
                {TRACKS.map((t: any, i) => (
                    <li key={t.id} className="px-4 py-3 hover:bg-white/2 transition-colors" onClick={(e: any) => {
                        e.stopPropagation();
                        playSong(t)
                    }}>
                        <div className="grid grid-cols-12 gap-4 items-center">
                            {/* index */}
                            <div className="col-span-1 text-sm text-white/70 ">
                                {
                                    currentSong?.id === t?.id ? <AudioBufferVisualizer w="w-1" color="bg-green-500" /> : <>{i + 1}</>
                                }


                            </div>

                            {/* title + small cover */}
                            <div className="col-span-6 flex items-center gap-4">
                                <img src={t.cover} alt={t.title} className="w-12 h-12 rounded object-cover" />
                                <div>
                                    <div className="font-medium">{t.title}</div>
                                    <div className="text-sm text-white/60">{t.artist}</div>
                                </div>
                            </div>

                            {/* album */}
                            <div className="col-span-3 text-sm text-white/70">{t.album}</div>

                            {/* date added (static) */}
                            <div className="col-span-1 text-sm text-white/60 text-right">—</div>

                            {/* duration */}
                            <div className="col-span-1 text-sm text-white/60 text-right">{t.duration}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </>
}