import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveDown } from 'lucide-react';
import Photocard from '../../components/Photocard';

gsap.registerPlugin(ScrollTrigger);

const Kita = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Placeholder animasi GSAP
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const totalColumns = 12;
  const wordRepeats = Array.from({ length: 16 });

  const kitaImgSrc = 'img/kita/amaze.png';

  return (
    <div
      ref={sectionRef}
      className="fixed inset-0 bg-[#121212] overflow-hidden select-none font-sans"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      <div className="absolute inset-0 flex justify-between items-center opacity-40 px-4 pointer-events-none z-0">
        {Array.from({ length: totalColumns }).map((_, colIdx) => {
          const isOddCol = colIdx % 2 !== 0;
          return (
            <div
              key={colIdx}
              className="h-[140vh] flex items-center justify-center shrink-0"
              style={{
                writingMode: 'vertical-rl',
                transform: `rotate(180deg) translateY(${isOddCol ? '-40px' : '0px'})`,
              }}
            >
              <h1 className="text-7xl font-black tracking-tighter uppercase leading-none flex gap-2 whitespace-nowrap">
                {wordRepeats.map((_, wordIdx) => {
                  const isRed = (colIdx + wordIdx) % 2 === 0;
                  const word = (wordIdx + (isOddCol ? 1 : 0)) % 2 === 0 ? 'KESSOKU' : 'BAND';
                  return (
                    <span key={wordIdx} className={isRed ? 'text-[#8B0D0D]' : 'text-[#808080]'}>
                      {word}
                    </span>
                  );
                })}
              </h1>
            </div>
          );
        })}
      </div>

      <div className="relative z-30 h-full flex flex-col justify-between p-8 text-white font-medium text-sm tracking-tight pointer-events-none">
        <div className="w-full grid grid-cols-3 items-start">
          <div className="leading-tight">
            <p className="font-bold">Kessoku</p>
            <p>Band</p>
          </div>
          <div className="text-center leading-tight">
            <p>Design by</p>
            <p className="font-bold">Perdafos</p>
          </div>
          <div className="text-right leading-tight">
            <p className="font-bold">Bocchi the</p>
            <p>rock</p>
          </div>
        </div>

        <div className="w-full flex justify-between items-end">
          <div className="leading-tight">
            <p className="font-bold">They're</p>
            <p>go to jakarta?!!</p>
          </div>
          <div className="text-right leading-tight">
            <p className="font-bold">let's buy</p>
            <p>the tickets</p>
          </div>
        </div>
      </div>

      <div className="absolute top-100 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[650px]">

        <div className="absolute -inset-40 pointer-events-none z-50 overflow-hidden">
          <div className="absolute inset-0 mix-blend-multiply opacity-90" style={{
            background: `radial-gradient(ellipse at 70% 15%, rgba(255,255,255,0.15) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)`,
          }} />
          <div className="absolute -top-[40%] -left-[30%] w-[180%] h-[240%] mix-blend-screen opacity-70" style={{
            background: 'linear-gradient(105deg, transparent 32%, rgba(255,241,209,0.5) 44%, rgba(255,250,235,0.9) 50%, rgba(255,241,209,0.5) 56%, transparent 68%)',
            transform: 'rotate(-22deg)', filter: 'blur(10px)',
          }} />
          <div className="absolute -top-[40%] -left-[30%] w-[180%] h-[240%] mix-blend-multiply opacity-55" style={{
            background: 'repeating-linear-gradient(-22deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 42px, rgba(0,0,0,0.6) 42px, rgba(0,0,0,0.6) 58px)', filter: 'blur(4px)',
          }} />
          <div className="absolute -top-24 right-0 w-[420px] h-[420px] mix-blend-screen opacity-90" style={{
            background: 'radial-gradient(circle, rgba(255,252,240,0.95) 0%, rgba(255,244,214,0.5) 35%, transparent 70%)', filter: 'blur(30px)',
          }} />
        </div>

        <div className="absolute -inset-40 pointer-events-none z-50 mix-blend-screen opacity-40">
          {Array.from({ length: 14 }).map((_, i) => {
            const size = 2 + (i % 4);
            const top = (i * 37) % 100;
            const left = (i * 53) % 100;
            return (
              <div key={i} className="absolute rounded-full bg-[#FFF6E0]" style={{ width: size, height: size, top: `${top}%`, left: `${left}%`, filter: 'blur(1px)' }} />
            );
          })}
        </div>

        <div className="absolute top-10 -right-24 w-[210px] h-[480px] bg-white text-black rotate-[12deg] shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-10 rounded-xs overflow-hidden border border-black/10 flex flex-col justify-between font-mono">
          <div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-multiply z-20" style={{ backgroundImage: `url("img/image-texture.jpg")`, backgroundSize: 'cover' }} />
          <div className="p-4 flex-1 flex flex-row-reverse justify-between items-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            <div className="flex flex-col justify-between items-start border-t pt-2 border-black/20 w-full">
              <div className="text-[9px] font-bold tracking-tighter">
                <p className="uppercase text-black/60">Passenger</p>
                <p className="text-[11px]">IKUYO KITA</p>
              </div>
              <div className="text-[9px] font-bold tracking-tighter">
                <p className="uppercase text-black/60">Flight</p>
                <p className="text-[11px]">NAMC YS-11</p>
              </div>
              <div className="text-[9px] font-bold tracking-tighter">
                <p className="uppercase text-black/60">Departure</p>
                <p className="text-[11px]">12.00 AM</p>
                <p className="text-[11px]">7 Sept 2026</p>
              </div>
              <div className="w-8 h-24 bg-transparent overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
                  <pattern id="fine-barcode-horizontal" width="100%" height="8" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="100%" height="1" fill="black" />
                    <rect x="0" y="2" width="100%" height="0.5" fill="black" />
                    <rect x="0" y="3.5" width="100%" height="1.5" fill="black" />
                    <rect x="0" y="6" width="100%" height="0.75" fill="black" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#fine-barcode-horizontal)" />
                </svg>
              </div>
            </div>
            <div className="my-auto px-2 flex flex-col justify-between items-center h-full">
              <div className="flex justify-between items-center my-auto gap-2 text-center">
                <div><p className="text-3xl font-black tracking-tighter leading-none">DHX</p><p className="text-[9px] text-black/60 font-semibold">Kediri</p></div>
                <span className="text-xl font-bold"><MoveDown /></span>
                <div><p className="text-3xl font-black tracking-tighter leading-none">CGK</p><p className="text-[9px] text-black/60 font-semibold">Jakarta</p></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-[8px] border-l border-black/10 pl-3 h-full justify-between">
              <div><p className="text-black/50">FLIGHT</p><p className="font-bold text-[10px]">NAMC YS-11</p></div>
              <div><p className="text-black/50">DEPARTURE</p><p className="text-[11px]">12.00 AM</p><p className="text-[11px]">7 Sept 2026</p></div>
              <div className="flex justify-between items-center text-[9px] pt-2 border-t border-dashed border-black/30">
                <div><p className="text-black/50">SEAT</p><p className="font-bold text-[11px]">30A</p></div>
                <div><p className="text-black/50">GATE</p><p className="font-bold text-[11px]">6</p></div>
              </div>
            </div>
          </div>
          <div className="bg-[#C82329] z-30">
            <div className="pt-4 px-1">
              <div className="h-8 w-full flex justify-between p-[2px] mb-2">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className={`h-full bg-white ${i % 4 === 0 ? 'w-[2.5px]' : i % 2 === 0 ? 'w-[1.5px]' : 'w-[1px]'}`} />
                ))}
              </div>
              <div className="h-2.5 w-full rounded-xs" />
            </div>
          </div>
        </div>

        <div className="absolute top-[450px] left-[300px] w-[290px] h-[290px] rounded-full z-[15] shadow-[0_20px_40px_rgba(0,0,0,0.85)] border border-white/20 overflow-hidden flex items-center justify-center">
          <img src="img/kita/album.webp" alt="Kessoku Band CD" className="absolute inset-0 w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]" style={{ transform: 'scaleX(-1)' }} />
          <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.7) 45deg, transparent 90deg, rgba(255,255,255,0.7) 225deg, transparent 270deg)' }} />
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 31%, transparent 32%, rgba(0,0,0,0.8) 50%, transparent 51%)', backgroundSize: '100% 100%' }} />
          <div className="relative z-10 w-[72px] h-[72px] rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-white/30 bg-black/50 backdrop-blur-[1px]" />
          </div>
        </div>

        <Photocard imgSrc={kitaImgSrc} />

        <div className="absolute bottom-[0px] left-[0px] w-[500px] h-[160px] bg-white text-black font-sans shadow-[0_30px_60px_rgba(0,0,0,0.85)] flex border border-black/15 select-none z-30 rotate-12" style={{ clipPath: `polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)` }}>
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply z-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          <div className="absolute -top-3.5 left-[310px] w-7 h-7 bg-[#121212] rounded-full z-40" />
          <div className="absolute -bottom-3.5 left-[310px] w-7 h-7 bg-[#121212] rounded-full z-40" />
          <div className="absolute top-0 bottom-0 left-[323px] border-l-2 border-dashed border-black/70 z-30" />

          <div className="w-[325px] p-5 flex items-stretch justify-between relative z-10">
            <div className="relative border-[4px] border-black p-2 pr-3 flex flex-col justify-between w-[185px] bg-white shadow-xs">
              <span className="absolute top-7 left-1 text-[#E07A5F] font-black text-xl tracking-tighter z-20 -rotate-6 whitespace-nowrap" style={{ textShadow: '1px 1px 0px #fff, -1px -1px 0px #fff, 1px -1px 0px #fff, -1px 1px 0px #fff' }}>ぼっち・ざ・ろっく!</span>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-[0.82] text-black">KESSOKU<br />BAND</h1>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-[2px] w-3 bg-black"></span>
                <span className="text-[10px] font-black tracking-widest uppercase">WORLD TOUR</span>
                <span className="h-[2px] w-full bg-black"></span>
              </div>
            </div>
            <div className="flex flex-col justify-between text-left pl-3 font-mono text-[9px] leading-tight">
              <div><p className="font-bold text-black/60 text-[8px] uppercase">Concert Ticket</p><p className="font-black text-sm text-black tracking-tight leading-none">JAKARTA</p></div>
              <div><p className="font-bold text-black/50 text-[7.5px] uppercase">PLACE</p><p className="font-extrabold text-[8.5px] leading-tight text-black uppercase">JAKARTA INTERNATIONAL<br />STADIUM</p></div>
              <div><p className="font-bold text-black/50 text-[7.5px] uppercase">DATE</p><p className="font-extrabold text-[8.5px] leading-tight text-black">06:00PM<br />12 APRIL 2025</p></div>
              <div><p className="font-bold text-black/50 text-[7.5px] uppercase">CATEGORY</p><p className="font-extrabold text-[9px] text-black">VIP 1</p></div>
            </div>
          </div>

          <div className="w-[175px] p-4 flex flex-col justify-between items-end relative z-10 pl-6">
            <div className="w-full flex justify-center mt-1">
              <div className="relative border-2 border-black rounded-full px-2 py-0.5 -rotate-12 flex items-center justify-center">
                <span className="font-extrabold text-[11px] tracking-tighter text-black">結束バンド</span>
                <div className="absolute inset-0 border border-black rounded-full scale-105 rotate-6 pointer-events-none" />
              </div>
            </div>
            <div className="w-full text-left font-mono text-[8px] space-y-2 pl-2">
              <div><p className="text-black/50 text-[7px] font-bold uppercase">DATE</p><p className="font-extrabold text-[8.5px] text-black leading-none">06:00PM</p><p className="font-extrabold text-[8.5px] text-black leading-none">12 APRIL 2025</p></div>
              <div><p className="text-black/50 text-[7px] font-bold uppercase">CATEGORY</p><p className="font-extrabold text-[9px] text-black leading-none">VIP 1</p></div>
            </div>
            <div className="w-full h-10 flex justify-between items-center px-1">
              {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} className={`h-full bg-black ${i % 5 === 0 ? 'w-[3px]' : i % 3 === 0 ? 'w-[2px]' : 'w-[1px]'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kita;
