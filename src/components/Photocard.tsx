import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const foldPanels = [
  {
    clipPath: 'polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%)',
    transform: 'translate(-0.3px, -0.4px) rotate(-0.03deg)',
    filter: 'brightness(1.01) contrast(1.005)',
  },
  {
    clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)',
    transform: 'translate(0.4px, -0.3px) rotate(0.03deg)',
    filter: 'brightness(0.98) contrast(1.01)',
  },
  {
    clipPath: 'polygon(0% 50%, 50% 50%, 50% 100%, 0% 100%)',
    transform: 'translate(-0.4px, 0.3px) rotate(0.03deg)',
    filter: 'brightness(0.97) contrast(1.005)',
  },
  {
    clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)',
    transform: 'translate(0.3px, 0.4px) rotate(-0.03deg)',
    filter: 'brightness(1.005) contrast(0.995)',
  },
];

interface PhotocardProps {
  className?: string;
  imgSrc?: string;
  title?: string;
  number?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  photoScale?: number;
}

const sizeMap = {
  sm: 'w-[260px] h-[340px]',
  md: 'w-[400px] h-[520px]',
  lg: 'w-[520px] h-[680px]',
};

const Photocard = ({
  className = '',
  imgSrc = 'img/kita/amaze.png',
  title = 'Ikuyo<br />Kita',
  number = '02',
  subtitle = 'KESSOKU BAND',
  size = 'md',
  photoScale = 250,
}: PhotocardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {}, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`${sizeMap[size]} bg-white p-4 -rotate-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] overflow-hidden rounded-xs ${className}`}
    >
      {/* TEKSTUR KERTAS | image-texture.jpg overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url("img/image-texture.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* LIGHTING & CRUMPLE GRADIENT */}
      <div
        className="absolute inset-0 pointer-events-none z-35 opacity-50 mix-blend-multiply"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.3) 48%, rgba(255,255,255,0.3) 52%, rgba(0,0,0,0.35) 100%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.35) 100%)
          `,
        }}
      />

      {/* GARIS LIPATAN SILANG HITAM (DARK CREASE) */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-3">
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0) 100%)',
              filter: 'blur(1px)',
            }}
          />
        </div>
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-3">
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0) 100%)',
              filter: 'blur(1px)',
            }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* Vignette Halus */}
      <div
        className="absolute inset-0 pointer-events-none z-45"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.08) 100%)',
        }}
      />

      {/* AREA FOTO INNER */}
      <div className="relative w-full h-full bg-[#FAFAFA] overflow-hidden rounded-xs">
        {/* Header Poster */}
        <div className="absolute top-16 right-8 z-20 text-black text-right">
          <div className="relative inline-block">
            <h2
              className="text-3xl font-black leading-none text-[#C82329] tracking-tight relative z-0"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div className="absolute top-1 right-0 z-10 pointer-events-none translate-y-[-50%]">
              <span
                className="text-2xl font-bold tracking-widest block font-mono text-transparent [-webkit-text-stroke:6px_white]"
                aria-hidden="true"
              >
                {number}
              </span>
              <span className="absolute inset-0 z-10 text-2xl font-bold tracking-widest block font-mono text-black">
                {number}
              </span>
            </div>
          </div>
        </div>

        {foldPanels.map((panel, i) => (
          <div key={i} className="absolute inset-0 z-0" style={{ clipPath: panel.clipPath }}>
            <div
              className="relative w-full h-full transition-transform duration-300"
              style={{ transform: panel.transform, filter: panel.filter }}
            >
              <img
                className="absolute w-full h-full object-contain object-left translate-x-3 -translate-y-5 opacity-40"
                src={imgSrc}
                alt="Shadow"
                style={{ filter: 'brightness(0.3) grayscale(100) opacity(0.5) blur(2px)', transform: `translateX(12px) translateY(-20px) scale(${photoScale})` }}
              />
              <img
                className="absolute w-full h-full object-contain object-left translate-y-4 -translate-x-5"
                src={imgSrc}
                alt="Main"
                style={{ transform: `translateY(16px) translateX(-20px) scale(${photoScale * 0.833})`, filter: 'contrast(1.05)' }}
              />
            </div>
          </div>
        ))}

        {/* BLOCK TEXT & BARCODE */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end text-right gap-1.5">
          <div className="text-[10px] font-mono leading-tight text-black/80 font-semibold uppercase tracking-wider">
            <p>Limited</p>
            <p>Photocard</p>
          </div>
          <div className="h-12 w-24 flex justify-between items-center p-[2px]">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className={`h-full bg-black ${i % 4 === 0 ? 'w-1' : i % 2 === 0 ? 'w-[2px]' : 'w-[1px]'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photocard;
