import { useEffect, useState } from 'react';
// @ts-ignore
import ColorThief from 'colorthief/dist/color-thief-node';

interface RadioCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
}

const RadioCard = ({ imageUrl, title, subtitle }: RadioCardProps) => {
  const [dominantColor, setDominantColor] = useState<string>('rgb(44, 44, 44)');

  useEffect(() => {
    if (!imageUrl) return;

    const extractColor = async () => {
      try {
        // @ts-ignore
        const ColorThiefConstructor = ColorThief.default || ColorThief;
        const thief = new ColorThiefConstructor();

        // Nou pran koulè a dirèkteman nan URL la
        const rgbPalette = await thief.getColor(imageUrl);

        // 2. Ranje TS7031: Nou bay 'r', 'g', 'b' tip nimewo eksplisitman
        const [r, g, b]: [number, number, number] = rgbPalette;

        setDominantColor(`rgb(${r}, ${g}, ${b})`);
        console.log(`🎨 Koulè RadioCard detekte: rgb(${r}, ${g}, ${b})`);
        
      } catch (err) {
        console.error("Erè ColorThief nan RadioCard:", err);
      }
    };

    extractColor();
  }, [imageUrl]);

  return (
    <div 
      style={{ backgroundColor: dominantColor }}
      className="p-4 rounded-2xl border border-white/5 transition-all duration-500 ease-in-out"
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-zinc-800 mb-4">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>
      <h3 className="text-white font-bold truncate">{title}</h3>
      {subtitle && <p className="text-zinc-400 text-xs truncate">{subtitle}</p>}
    </div>
  );
};

export default RadioCard;