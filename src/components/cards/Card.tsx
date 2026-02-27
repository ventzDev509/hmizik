import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useAudio } from "../../provider/PlayerContext";
import { FiPlay } from "react-icons/fi";
import AudioBufferVisualizer from "../buffer/Buffer";
import { useNavigate } from "react-router-dom";

interface CardProps {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    song?: any;
    setSelect: any;
}

export default function Card({ id, image, title, subtitle, song, setSelect }: CardProps) {
    const colors = useSelector((state: RootState) => state.theme.colors);
    const { playSong, currentSong } = useAudio();
    const navigation = useNavigate()

    return (
        <div
            className={`rounded-lg ${colors.grayOpacity} relative p-3 flex flex-col gap-2 cursor-pointer hover:bg-gray-600/30 transition group`}

        >
            {/* Image avec bouton Play */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <img
                    onClick={() => navigation("/playlist")}
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition duration-300"
                />

                {/* Bouton Play en overlay */}
                <div

                    className={`absolute ${currentSong?.id === id ? '    bg-green-500 w-11 h-11 bottom-2  rounded-full ' : 'bottom-2 opacity-0 bg-green-500 group-hover:opacity-100 transition  duration-300  text-white rounded-full shadow-lg'} right-2 p-3   `}
                    onClick={(e) => {
                        e.stopPropagation();
                        playSong(song);
                        setSelect(song)
                    }}
                >
                    {currentSong?.id === id ? <>
                        <AudioBufferVisualizer w="w-2.5" color="bg-white" />

                    </> : <FiPlay size={20} />}

                </div>
            </div>

            {/* Infos */}
            <div className="flex flex-col">
                <span className="text-white font-semibold truncate">{title}</span>
                {subtitle && (
                    <span className="text-gray-400 text-sm truncate">{subtitle}</span>
                )}
            </div>
        </div>
    );
}
