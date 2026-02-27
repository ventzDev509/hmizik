import { useEffect, useState } from "react";

interface BufferProps {
  w?: string;
  h?: string;
  color?: string
}
export default function AudioBufferVisualizer({ color, w, }: BufferProps) {
  const BAR_COUNT = 3;
  const MIN_HEIGHT = 4;
  const MAX_HEIGHT = 20;

  const [heights, setHeights] = useState(Array(BAR_COUNT).fill(MIN_HEIGHT));

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(
        heights.map(() => MIN_HEIGHT + Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT)))
      );
    }, 180);
    return () => clearInterval(interval);
  }, [heights]);

  return (
    <div className="flex items-end gap-1 h-6">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}px`, transition: "height 0.15s ease-in-out" }}
          className={`${w!="" ? w : "w-2.5"} ${color!="" ? color : "bg-white"} rounded-b`}
        />
      ))}
    </div>
  );
}
