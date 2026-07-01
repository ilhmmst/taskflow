import { useEffect, useRef } from "react";
import gsap from "gsap";

interface InfiniteMarqueeProps {
  text: string;
  speed?: number;
  direction?: "left" | "right";
  containerClassName?: string;
  textClassName?: string;
}

export const InfiniteMarquee = ({
  text,
  speed = 12,
  direction = "left",
  containerClassName = "",
  textClassName = "",
}: InfiniteMarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const startAnim = () => {
      const partWidth = track.scrollWidth / 4;
      // Jangan jalankan animasi kalau partWidth masih 0 (elemen belum visible)
      if (partWidth <= 0) return;

      // Hentikan animasi lama kalau ada
      animRef.current?.kill();

      // Set posisi awal
      gsap.set(track, { x: direction === "left" ? 0 : -partWidth });

      animRef.current = gsap.to(track, {
        x: direction === "left" ? -partWidth : 0,
        duration: speed,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x: string) => {
            const val = parseFloat(x);
            if (direction === "left") {
              return (((val % partWidth) - partWidth) % -partWidth) + "px";
            } else {
              return ((val % partWidth + partWidth) % partWidth) + "px";
            }
          },
        },
      });
    };

    // Coba langsung — kalau elemen sudah punya ukuran
    startAnim();

    // Kalau belum, pakai ResizeObserver untuk tunggu sampai elemen visible
    const observer = new ResizeObserver(() => {
      if (track.scrollWidth > 0) {
        startAnim();
      }
    });
    observer.observe(track);

    return () => {
      animRef.current?.kill();
      observer.disconnect();
    };
  }, [speed, direction]);

  const copies = [0, 1, 2, 3];

  return (
    <div className={`overflow-hidden select-none w-full ${containerClassName}`}>
      <div ref={trackRef} className="flex shrink-0 whitespace-nowrap">
        {copies.map((i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-4 pr-8"
            aria-hidden={i > 0 ? "true" : undefined}
          >
            <h1
              className={`uppercase font-heading font-extrabold tracking-tight ${textClassName}`}
            >
              {text} —
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};