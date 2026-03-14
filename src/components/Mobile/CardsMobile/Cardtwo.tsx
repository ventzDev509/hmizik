import { useNavigate } from "react-router-dom";

function CardTwo() {
  const navigate=useNavigate()
  return (
    <>
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4 px-1 text-white/90">Mix ki fèt pou ou</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div onClick={()=>navigate("/song")} key={i} className="min-w-[155px] bg-[#1f1e1e] rounded-md  snap-start group cursor-pointer">
              {/* CONTAINER IMAJ LA */}
              <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                <img
                crossOrigin="anonymous"
                  src={`https://picsum.photos/seed/${i + 50}/300/300`}
                  alt="Album Cover"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* OVERLAY NWA (pou wave la ka parèt byen) */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                {/* --- ANIMASYON WAVE (Sèlman sou premye a oswa lè w hover) --- */}
                <div className="absolute  bottom-3 right-3 flex items-end gap-[2px] h-4">
                  <div className="w-[3px] bg-green-500 animate-[wave_0.6s_ease-in-out_infinite]" style={{ height: '60%' }}></div>
                  <div className="w-[3px] bg-green-500 animate-[wave_0.9s_ease-in-out_infinite]" style={{ height: '100%' }}></div>
                  <div className="w-[3px] bg-green-500 animate-[wave_0.7s_ease-in-out_infinite]" style={{ height: '80%' }}></div>
                  <div className="w-[3px] bg-green-500 animate-[wave_1.1s_ease-in-out_infinite]" style={{ height: '40%' }}></div>
                </div>
              </div>

              {/* TÈKS YO */}
              <h3 className="text-[13px] px-2 font-bold truncate text-white/90 group-hover:text-green-500 transition-colors">
                Daily Mix {i}
              </h3>
              <p className="text-[11px] px-2 py-1 text-[#b3b3b3] mt-0 leading-tight line-clamp-2">
                Atis tankou Roody Roodboy, Baky ak plis...
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STYLES POU ANIMASYON WAVE LA */}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

export default CardTwo;