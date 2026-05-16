import { useState, useEffect, useRef } from "react";
// @ts-ignore
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
        // Ranje pwoblèm 'not constructable' la pou anviwònman pwodiksyon (Render)
        // @ts-ignore
        const ColorThiefConstructor = ColorThief.default || ColorThief;
        const colorThief = new ColorThiefConstructor();
        
        const palette: number[][] | null = colorThief.getPalette(img, 8); 
        if (!palette || palette.length === 0) return;

        // Tipe [r, g, b] kòm number[] pou evite TS7031
        const getSaturation = ([r, g, b]: number[]): number => {
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max === 0) return 0;
          return ((max - min) / max) * 100;
        };

        // Tipe 'prev' ak 'curr' kòm number[] pou evite TS7006
        const mostVividColor = palette.reduce((prev: number[], curr: number[]) =>
          getSaturation(curr) > getSaturation(prev) ? curr : prev
        );

        const rgb = `rgb(${mostVividColor[0]}, ${mostVividColor[1]}, ${mostVividColor[2]})`;
        setBgColor(rgb);

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

    // Si imèl/imaj la te deja fin chaje nan kach navigatè a anvan evènman an koute
    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
    }

    return () => img.removeEventListener("load", handleLoad);
  }, [imageSrc]);

  return { bgColor, textColor, imgRef };
}