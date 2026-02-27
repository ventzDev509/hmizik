import { useNavigate } from "react-router-dom"

function CardOne() {
    const navigate =useNavigate()
    return <>
        <section className="mt-8">
            <h2 className="text-xl font-bold mb-4 px-1 text-white/90">Mix ki fèt pou ou</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div onClick={()=>navigate("/song")} key={i} className="min-w-[155px] snap-start">
                        <div className="relative w-full aspect-square mb-3">
                            <img
                                src={`https://picsum.photos/seed/${i + 50}/300/300`}
                                alt="Album Cover"
                                className="w-full h-full object-cover rounded-md shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
                            />
                        </div>
                        <h3 className="text-[13px] font-bold truncate text-white/90">Daily Mix {i}</h3>
                        <p className="text-[11px] text-[#b3b3b3] mt-1 leading-tight line-clamp-2">
                            Atis tankou Roody Roodboy, Baky ak plis...
                        </p>
                    </div>
                ))}
            </div>
        </section>
    </>
}

export default CardOne