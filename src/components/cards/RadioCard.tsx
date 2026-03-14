import { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import { useNavigate } from "react-router-dom";

interface CardRadioProps {
  image: string;
  title: string;
  subtitle: string;
}

export default function CardRadio({ image, title, subtitle }: CardRadioProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState<string>("#2c2c2c");
  const [textColor, setTextColor] = useState<string>("white");
const navigate=useNavigate()
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !image) return;

    img.crossOrigin = "anonymous";

    const handleLoad = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5); 
        if (!palette) return;

        // choisir la couleur la plus “chaude” (plus rouge)
        let warmest = palette[0];
        let maxRed = 0;
        palette.forEach(([r, g, b]) => {
          const redScore = r - (g + b) / 1 ; //2 plus r est élevé par rapport à g/b, plus c'est chaud
          if (redScore > maxRed) {
            maxRed = redScore;
            warmest = [r, g, b];
          }
        });

        const rgb = `rgb(${warmest[0]}, ${warmest[1]}, ${warmest[2]})`;
        setBgColor(rgb);

        // --- Calcul luminance pour texte clair/foncé ---
        const luminance =
          (0.299 * warmest[0] + 0.587 * warmest[1] + 0.114 * warmest[2]) / 255;
        setTextColor(luminance > 0.6 ? "black" : "white");
      } catch (err) {
        console.error("ColorThief error:", err);
      }
    };

    img.addEventListener("load", handleLoad);
    return () => img.removeEventListener("load", handleLoad);
  }, [image]);

  return (
    <div
      className="flex flex-col  gap-4 overflow-x-auto rounded-lg overflow-hidden p-4 flex-shrink-0 w-48 cursor-pointer transition-transform"
      style={{ backgroundColor: bgColor }}
      onClick={()=>navigate("/artiste")}
    >
      {/* TOP (logo Spotify + RADIO) */}
      <div className={`flex justify-between items-center text-xs mb-1`} style={{ color: textColor }}>
        <span>🎵</span>
        <span className="uppercase tracking-widest font-semibold">Radio</span>
      </div>

      {/* IMAGE */}
      <img
      crossOrigin="anonymous"
        ref={imgRef}
        src={image}
        alt={title}
        className="w-32 h-32 object-cover rounded-full mx-auto shadow"
      />

      {/* TEXTE */}
      <h3
        className="text-lg font-bold mt-1 truncate"
        style={{ color: textColor }}
      >
        {title}
      </h3>
      <p
        className="text-sm truncate"
        style={{ color: textColor === "white" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
