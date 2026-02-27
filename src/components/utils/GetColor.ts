import { useState, useEffect, useRef } from "react";
import ColorThief from "colorthief";

type UseImageColorsResult = {
  bgColor: string;
  textColor: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
};

export function useImageColors(imageSrc?: string): UseImageColorsResult {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState<string>("#2c2c2c");
  const [textColor, setTextColor] = useState<string>("white");

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !imageSrc) return;

    img.crossOrigin = "anonymous";

    const handleLoad = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 8); // top 8 couleurs
        if (!palette) return;

        // Fonction pour calculer la saturation d'une couleur RGB
        const getSaturation = ([r, g, b]: number[]) => {
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max === 0) return 0;
          return ((max - min) / max) * 100;
        };

        // Trouver la couleur la plus vive
        const mostVividColor = palette.reduce((prev, curr) =>
          getSaturation(curr) > getSaturation(prev) ? curr : prev
        );

        const rgb = `rgb(${mostVividColor[0]}, ${mostVividColor[1]}, ${mostVividColor[2]})`;
        setBgColor(rgb);

        // Déterminer si le texte doit être clair ou foncé
        const luminance =
          (0.299 * mostVividColor[0] +
            0.587 * mostVividColor[1] +
            0.114 * mostVividColor[2]) /
          255;
        setTextColor(luminance > 0.6 ? "black" : "white");
      } catch (err) {
        console.error("ColorThief error:", err);
      }
    };

    img.addEventListener("load", handleLoad);
    return () => img.removeEventListener("load", handleLoad);
  }, [imageSrc]);

  return { bgColor, textColor, imgRef };
}
