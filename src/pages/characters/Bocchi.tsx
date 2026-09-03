import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveDown, User, Sparkles, Guitar, Mail, Scissors, ArrowLeft } from 'lucide-react';
import Photocard from '../../components/Photocard';
import { useCharacterPageTransition } from '../../hooks/useCharacterPageTransition';

gsap.registerPlugin(ScrollTrigger);

interface BocchiProps {
  onBack?: () => void;
}

const Bocchi = ({ onBack }: BocchiProps) => {
  const { sectionRef, isExiting, setupEntrance, handleBackClick } = useCharacterPageTransition(() => onBack?.());
  const ticketRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scissorsRef = useRef<HTMLDivElement>(null);
  const bounceTweenRef = useRef<gsap.core.Tween | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTearing, setIsTearing] = useState(false);

  // Drag Gesture States
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef(0);

  const slides = [
    {
      id: 'about',
      title: 'ABOUT ME',
      category: 'PROFILE PASS',
      icon: <User className="w-4 h-4 text-black" />,
      content: (
        <div className="space-y-2.5 text-xs leading-relaxed text-black font-mono">
          <p className="font-semibold">
            Um... h-hello... I’m Hitori Gotoh, but everyone usually calls me <span className="bg-[#ec4899] text-white px-1 font-bold">Bocchi!</span>
          </p>
          <p className="text-black/80">
            I’m the lead guitarist of Kessoku Band. I spend most of my days practicing guitar in my closet and dreaming of becoming popular, even though my social anxiety turns me into dust whenever people look at me. But playing music with everyone helps me feel alive!
          </p>
        </div>
      ),
      photo: 'img/hitori/aboutme.jpg',
      caption: 'GUITAR HERO',
      seat: '01B',
    },
    {
      id: 'funfact',
      title: 'FUN FACT',
      category: 'TRIVIA STUB',
      icon: <Sparkles className="w-4 h-4 text-black" />,
      content: (
        <ul className="space-y-2 text-xs font-mono text-black list-disc list-inside">
          <li>Literally disintegrates, glitches, or turns into ash when experiencing extreme panic.</li>
          <li>Famous online as the guitar virtuoso "GuitarHero" with millions of views.</li>
          <li>Wears a pink tracksuit almost all the time because it feels safe.</li>
          <li>Secretly writes all of Kessoku Band's deep and emotional lyrics.</li>
        </ul>
      ),
      photo: 'img/hitori/funfact.jpg',
      caption: 'SOCIAL ANXIETY',
      seat: '01F',
    },
    {
      id: 'equipment',
      title: 'EQUIPMENT',
      category: 'GEAR LOG',
      icon: <Guitar className="w-4 h-4 text-black" />,
      content: (
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-black">
          <div className="bg-black/5 p-2 border border-black/25">
            <p className="font-bold text-black uppercase">MAIN GUITAR</p>
            <p className="text-black/70">Gibson Les Paul Custom</p>
          </div>
          <div className="bg-[#121212]/5 p-2 border border-black/25">
            <p className="font-bold text-black uppercase">INTERFACE</p>
            <p className="text-black/70">Yamaha THR10II Desktop Amp</p>
          </div>
          <div className="bg-black/5 p-2 border border-black/25">
            <p className="font-bold text-black uppercase">PC SETUP</p>
            <p className="text-black/70">DAW for GuitarHero Uploads</p>
          </div>
          <div className="bg-black/5 p-2 border border-black/25">
            <p className="font-bold text-black uppercase">BACKPACK</p>
            <p className="text-black/70">Emergency Survival Kit</p>
          </div>
        </div>
      ),
      photo: 'img/hitori/gear.jpg',
      caption: 'STAGE RIG',
      seat: '01G',
    },
    {
      id: 'contact',
      title: 'CONTACT ME',
      category: 'CONNECT CARD',
      icon: <Mail className="w-4 h-4 text-black" />,
      content: (
        <div className="space-y-2 text-xs font-mono text-black">
          <p className="text-[10px] text-black/60 font-bold uppercase">// ONLINE INQUIRIES & CLOSET</p>
          <div className="space-y-1.5 border-l-2 border-[#ec4899] pl-3">
            <div>
              <span className="font-bold uppercase text-black/50 text-[9px] block">LOCATION</span>
              <span className="text-black font-bold">Inside my Closet, Tokyo, JP</span>
            </div>
            <div>
              <span className="font-bold uppercase text-black/50 text-[9px] block">AFFILIATION</span>
              <span className="text-black font-bold">Kessoku Band / GuitarHero</span>
            </div>
          </div>
        </div>
      ),
      photo: 'img/hitori/contactme.jpg',
      caption: 'CLOSET STUDIO',
      seat: '01H',
    },
  ];

  // Smooth Looping Bounce Animation
  useEffect(() => {
    if (scissorsRef.current) {
      bounceTweenRef.current = gsap.to(scissorsRef.current, {
        y: 10,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    return () => {
      if (bounceTweenRef.current) bounceTweenRef.current.kill();
    };
  }, [currentSlide]);

  const playTuingAnimation = () => {
    if (!scissorsRef.current || isTearing) return;

    if (bounceTweenRef.current) bounceTweenRef.current.pause();

    gsap.timeline({
      onComplete: () => {
        if (bounceTweenRef.current && !isDragging) bounceTweenRef.current.play();
      },
    })
      .to(scissorsRef.current, { scaleX: 1.35, scaleY: 0.75, duration: 0.12, ease: 'power2.out' })
      .to(scissorsRef.current, { scaleX: 0.85, scaleY: 1.25, duration: 0.15, ease: 'power2.out' })
      .to(scissorsRef.current, { scaleX: 1.1, scaleY: 0.95, duration: 0.12, ease: 'power2.out' })
      .to(scissorsRef.current, { scaleX: 1, scaleY: 1, duration: 0.25, ease: 'elastic.out(1, 0.4)' });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isTearing) return;
    setIsDragging(true);
    startYRef.current = e.clientY;

    if (bounceTweenRef.current) bounceTweenRef.current.pause();
    playTuingAnimation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isTearing) return;
    const deltaY = Math.max(0, e.clientY - startYRef.current);
    setDragY(deltaY);

    if (deltaY > 65) {
      setIsDragging(false);
      setDragY(0);
      executeTearAnimation();
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragY(0);
    if (bounceTweenRef.current) bounceTweenRef.current.play();
  };

  const executeTearAnimation = () => {
    if (isTearing) return;
    setIsTearing(true);

    const activeEl = ticketRefs.current[currentSlide];
    if (!activeEl) return;

    const stubEl = activeEl.querySelector('.stub-tear-target');

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        gsap.set(activeEl, { x: 0, y: 0, rotation: 0, opacity: 1 });
        if (stubEl) gsap.set(stubEl, { x: 0, y: 0, rotation: 0, opacity: 1 });
        setIsTearing(false);
      },
    });

    tl.to(stubEl, {
      y: 280,
      x: 45,
      rotation: 35,
      opacity: 0,
      duration: 0.45,
      ease: 'power3.in',
    }).to(
      activeEl,
      {
        y: -420,
        rotation: -10,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
      },
      '-=0.25'
    );
  };

  // Animasi Masuk (Entrance Animation) saat halaman dibuka
  useEffect(() => {
    return setupEntrance();
  }, [setupEntrance]);

  const totalColumns = 12;
  const wordRepeats = Array.from({ length: 16 });
  const bocchiImgSrc = 'img/hitori/photocard.png';

  return (
    <div
      ref={sectionRef}
      className="fixed inset-0 bg-[#0a0a0a] overflow-hidden select-none font-sans"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(45, 45, 45, 0.4) 0%, rgba(10, 10, 10, 0.95) 80%),
          linear-gradient(to bottom, #0d0d0d, #050505)
        `,
      }}
    >
      {/* --- BACKGROUND TYPOGRAPHY PATTERN --- */}
      <div className="absolute inset-0 flex justify-between items-center opacity-30 px-4 pointer-events-none z-0">
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
                  const isPink = (colIdx + wordIdx) % 2 === 0;
                  const word = (wordIdx + (isOddCol ? 1 : 0)) % 2 === 0 ? 'KESSOKU' : 'BAND';
                  return (
                    <span key={wordIdx} className={isPink ? 'text-[#db2777]' : 'text-[#808080]'}>
                      {word}
                    </span>
                  );
                })}
              </h1>
            </div>
          );
        })}
      </div>

      {/* --- GLOBAL FULL-SCREEN LIGHTING & SHADOW OVERLAYS --- */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <div
          className="absolute inset-0 mix-blend-multiply opacity-90"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 45%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.9) 100%)`,
          }}
        />
        <div
          className="absolute -top-[50%] -left-[30%] w-[180%] h-[240%] mix-blend-screen opacity-65"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(251,207,232,0.45) 42%, rgba(253,242,248,0.85) 50%, rgba(251,207,232,0.45) 58%, transparent 70%)',
            transform: 'rotate(-22deg)',
            filter: 'blur(12px)',
          }}
        />
        <div
          className="absolute -top-[50%] -left-[30%] w-[180%] h-[240%] mix-blend-multiply opacity-50"
          style={{
            background:
              'repeating-linear-gradient(-22deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 40px, rgba(0,0,0,0.65) 40px, rgba(0,0,0,0.65) 60px)',
            filter: 'blur(5px)',
          }}
        />
        <div
          className="absolute top-0 right-1/4 w-[600px] h-[600px] mix-blend-screen opacity-75"
          style={{
            background:
              'radial-gradient(circle, rgba(253,242,248,0.8) 0%, rgba(251,207,232,0.3) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* --- OVERLAY TEXT UI & TOMBOL KEMBALI KE MAIN --- */}
      <div className="relative z-60 h-full flex flex-col justify-between p-8 text-white font-medium text-sm tracking-tight pointer-events-none">
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
            <p>go to concert?!!</p>
          </div>
          <button
            onClick={handleBackClick}
            disabled={isExiting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ec4899] text-white font-mono font-bold text-xs border-2 border-white shadow-[3px_3px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#fff] transition-all cursor-pointer uppercase pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> BACK
          </button>
          <div className="text-right leading-tight">
            <p className="font-bold">let's buy</p>
            <p>the tickets</p>
          </div>
        </div>
      </div>

      {/* --- STACKED TICKET CAROUSEL CONTAINER --- */}
      <div className="absolute top-1/2 right-[3%] -translate-y-1/2 w-[590px] z-40 flex flex-col gap-3 font-mono">
        <div className="relative w-full h-[360px]">
          {slides.map((slide, idx) => {
            const stackIndex = (idx - currentSlide + slides.length) % slides.length;
            const isTop = stackIndex === 0;

            const translateY = stackIndex * 7;
            const translateX = stackIndex * -4;
            const rotate = (stackIndex % 2 === 0 ? 1 : -1) * (stackIndex * 2);
            const scale = 1 - stackIndex * 0.03;
            const zIndex = 40 - stackIndex;

            return (
              <div
                key={slide.id}
                ref={(el) => { ticketRefs.current[idx] = el; }}
                className="absolute inset-0 w-full h-[360px] bg-white text-black p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex border-2 border-black overflow-hidden select-none"
                style={{
                  zIndex,
                  transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  clipPath: `polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)`,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply z-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
                
                <div className="absolute -top-3.5 left-[370px] w-6 h-6 bg-[#121212] rounded-full z-40 border border-black" />
                <div className="absolute -bottom-3.5 left-[370px] w-6 h-6 bg-[#121212] rounded-full z-40 border border-black" />
                <div className="absolute top-0 bottom-0 left-[381px] border-l-2 border-dashed border-black/70 z-30" />

                {isTop && (
                  <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onMouseEnter={playTuingAnimation}
                    className="absolute top-3 left-[365px] w-8 h-24 z-50 cursor-ns-resize group flex flex-col items-center"
                    title="Tarik gunting ini ke bawah untuk menyobek tiket!"
                  >
                    <div
                      ref={scissorsRef}
                      className="mt-2 w-7 h-7 rounded-full text-black flex items-center justify-center transition-transform origin-center"
                    >
                      <Scissors className="w-4 h-4 rotate-90 drop-shadow-xs" />
                    </div>
                  </div>
                )}

                <div className="w-[375px] pr-5 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          {slide.icon}
                          <h2 className="text-lg font-black tracking-tighter uppercase text-black leading-none">
                            {slide.title}
                          </h2>
                        </div>
                        <p className="text-[8px] font-bold text-black/50 tracking-widest uppercase mt-0.5">
                          {slide.category}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="bg-[#ec4899] text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                          PASS NO. 0{idx + 1}
                        </span>
                        <span className="text-[8px] font-bold text-black/50 uppercase mt-0.5">
                          SEAT {slide.seat}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">{slide.content}</div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-black/40 flex justify-between items-end text-[8px] text-black/60 font-bold uppercase">
                    <div>
                      <p className="text-black/50">EVENT PASS / JAKARTA 2026</p>
                      <p className="text-[10px] text-black font-extrabold leading-tight">KESSOKU BAND TOUR</p>
                    </div>

                    <div className="w-16 h-5 overflow-hidden opacity-80">
                      <svg className="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
                        <pattern id={`fine-barcode-bocchi-${idx}`} width="100%" height="10" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="100%" height="2" fill="black" />
                          <rect x="0" y="3" width="100%" height="1" fill="black" />
                          <rect x="0" y="5" width="100%" height="2.5" fill="black" />
                          <rect x="0" y="8" width="100%" height="1" fill="black" />
                        </pattern>
                        <rect width="100%" height="100%" fill={`url(#fine-barcode-bocchi-${idx})`} />
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  className="stub-tear-target w-[170px] pl-4 flex flex-col justify-between items-end relative z-10"
                  style={{
                    transform: isTop && isDragging ? `translateY(${dragY}px) rotate(${dragY * 0.2}deg)` : 'none',
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div className="w-full flex justify-center mt-0.5">
                    <div className="relative border-2 border-black rounded-full px-2 py-0.5 -rotate-6 flex items-center justify-center bg-white shadow-xs">
                      <span className="font-extrabold text-[10px] tracking-tighter text-black">結束バンド</span>
                      <div className="absolute inset-0 border border-black rounded-full scale-105 rotate-6 pointer-events-none" />
                    </div>
                  </div>

                  <div className="w-full h-[200px] bg-white border-2 border-black p-1 flex flex-col justify-between shadow-xs">
                    <div className="w-full h-[155px] bg-black/5 border border-black/20 overflow-hidden relative">
                      <img
                        src={slide.photo}
                        alt={slide.caption}
                        className="w-full h-full object-cover object-top filter contrast-[1.05]"
                        loading="eager" decoding="sync" fetchPriority="high"
                      />
                    </div>
                    <div className="text-center pt-0.5">
                      <p className="text-[8.5px] font-black uppercase text-black leading-none tracking-tighter">
                        {slide.caption}
                      </p>
                      <p className="text-[7.5px] font-extrabold text-[#db2777] tracking-widest mt-0.5">
                        HITORI GOTOH
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-7 flex justify-between items-center px-0.5">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-black ${
                          i % 4 === 0 ? 'w-[2.5px]' : i % 2 === 0 ? 'w-[1.5px]' : 'w-[1px]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- DECORATIVE COLLAGE ELEMENTS ON THE LEFT SIDE --- */}
      <div className="absolute top-100 left-100 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[650px]">
        <div className="absolute -inset-40 pointer-events-none z-50 mix-blend-screen opacity-40">
          {Array.from({ length: 14 }).map((_, i) => {
            const size = 2 + (i % 4);
            const top = (i * 37) % 100;
            const left = (i * 53) % 100;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-[#FCE7F3]"
                style={{ width: size, height: size, top: `${top}%`, left: `${left}%`, filter: 'blur(1px)' }}
              />
            );
          })}
        </div>

        {/* 1. Tiket Penerbangan */}
        <div className="absolute top-10 -right-24 w-[210px] h-[480px] bg-white text-black rotate-[12deg] shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-10 rounded-xs overflow-hidden border border-black/10 flex flex-col justify-between font-mono">
          <div
            className="absolute inset-0 pointer-events-none opacity-15 mix-blend-multiply z-20"
            style={{ backgroundImage: `url("img/image-texture.jpg")`, backgroundSize: 'cover' }}
          />
          <div
            className="p-4 flex-1 flex flex-row-reverse justify-between items-center"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            <div className="flex flex-col justify-between items-start border-t pt-2 border-black/20 w-full">
              <div className="text-[9px] font-bold tracking-tighter">
                <p className="uppercase text-black/60">Passenger</p>
                <p className="text-[11px]">HITORI GOTOH</p>
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
                  <pattern id="fine-barcode-horizontal-bocchi" width="100%" height="8" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="100%" height="1" fill="black" />
                    <rect x="0" y="2" width="100%" height="0.5" fill="black" />
                    <rect x="0" y="3.5" width="100%" height="1.5" fill="black" />
                    <rect x="0" y="6" width="100%" height="0.75" fill="black" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#fine-barcode-horizontal-bocchi)" />
                </svg>
              </div>
            </div>
            <div className="my-auto px-2 flex flex-col justify-between items-center h-full">
              <div className="flex justify-between items-center my-auto gap-2 text-center">
                <div>
                  <p className="text-3xl font-black tracking-tighter leading-none">DHX</p>
                  <p className="text-[9px] text-black/60 font-semibold">Kediri</p>
                </div>
                <span className="text-xl font-bold">
                  <MoveDown />
                </span>
                <div>
                  <p className="text-3xl font-black tracking-tighter leading-none">CGK</p>
                  <p className="text-[9px] text-black/60 font-semibold">Jakarta</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-[8px] border-l border-black/10 pl-3 h-full justify-between">
              <div>
                <p className="text-black/50">FLIGHT</p>
                <p className="font-bold text-[10px]">NAMC YS-11</p>
              </div>
              <div>
                <p className="text-black/50">DEPARTURE</p>
                <p className="text-[11px]">12.00 AM</p>
                <p className="text-[11px]">7 Sept 2026</p>
              </div>
              <div className="flex justify-between items-center text-[9px] pt-2 border-t border-dashed border-black/30">
                <div>
                  <p className="text-black/50">SEAT</p>
                  <p className="font-bold text-[11px]">30A</p>
                </div>
                <div>
                  <p className="text-black/50">GATE</p>
                  <p className="font-bold text-[11px]">6</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#ec4899] z-30">
            <div className="pt-4 px-1">
              <div className="h-8 w-full flex justify-between p-[2px] mb-2">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full bg-white ${
                      i % 4 === 0 ? 'w-[2.5px]' : i % 2 === 0 ? 'w-[1.5px]' : 'w-[1px]'
                    }`}
                  />
                ))}
              </div>
              <div className="h-2.5 w-full rounded-xs" />
            </div>
          </div>
        </div>

        {/* 2. Piringan CD Album */}
        <div className="absolute top-[450px] left-[300px] w-[290px] h-[290px] rounded-full z-[15] shadow-[0_20px_40px_rgba(0,0,0,0.85)] border border-white/20 overflow-hidden flex items-center justify-center">
          <img
            src="img/hitori/album.jpg"
            alt="Kessoku Band CD"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
            loading="eager" decoding="sync" fetchPriority="high"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.7) 45deg, transparent 90deg, rgba(255,255,255,0.7) 225deg, transparent 270deg)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 31%, transparent 32%, rgba(0,0,0,0.8) 50%, transparent 51%)',
              backgroundSize: '100% 100%',
            }}
          />
          <div className="relative z-10 w-[72px] h-[72px] rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-white/30 bg-black/50 backdrop-blur-[1px]" />
          </div>
        </div>

        {/* 3. Photocard */}
        <Photocard imgSrc={bocchiImgSrc} photoScale={1.3}/>

        {/* 4. Tiket Konser Besar (Kiri Bawah) */}
        <div
          className="absolute bottom-[0px] left-[0px] w-[500px] h-[160px] bg-white text-black font-sans shadow-[0_30px_60px_rgba(0,0,0,0.85)] flex border border-black/15 select-none z-30 rotate-12"
          style={{
            clipPath: `polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)`,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply z-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute -top-3.5 left-[310px] w-7 h-7 bg-[#121212] rounded-full z-40" />
          <div className="absolute -bottom-3.5 left-[310px] w-7 h-7 bg-[#121212] rounded-full z-40" />
          <div className="absolute top-0 bottom-0 left-[323px] border-l-2 border-dashed border-black/70 z-30" />

          <div className="w-[325px] p-5 flex items-stretch justify-between relative z-10">
            <div className="relative border-[4px] border-black p-2 pr-3 flex flex-col justify-between w-[185px] bg-[#fff] shadow-xs">
              <span
                className="absolute top-7 left-1 text-[#ec4899] font-black text-xl tracking-tighter z-20 -rotate-6 whitespace-nowrap"
                style={{
                  textShadow:
                    '1px 1px 0px #fff, -1px -1px 0px #fff, 1px -1px 0px #fff, -1px 1px 0px #fff',
                }}
              >
                ぼっち・ざ・ろっく!
              </span>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-[0.82] text-black">
                KESSOKU<br />BAND
              </h1>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-[2px] w-3 bg-black"></span>
                <span className="text-[10px] font-black tracking-widest uppercase">WORLD TOUR</span>
                <span className="h-[2px] w-full bg-black"></span>
              </div>
            </div>
            <div className="flex flex-col justify-between text-left pl-3 font-mono text-[9px] leading-tight">
              <div>
                <p className="font-bold text-black/60 text-[8px] uppercase">Concert Ticket</p>
                <p className="font-black text-sm text-black tracking-tight leading-none">JAKARTA</p>
              </div>
              <div>
                <p className="font-bold text-black/50 text-[7.5px] uppercase">PLACE</p>
                <p className="font-extrabold text-[8.5px] leading-tight text-black uppercase">
                  JAKARTA INTERNATIONAL<br />STADIUM
                </p>
              </div>
              <div>
                <p className="font-bold text-black/50 text-[7.5px] uppercase">DATE</p>
                <p className="font-extrabold text-[8.5px] leading-tight text-black">
                  06:00PM<br />12 APRIL 2025
                </p>
              </div>
              <div>
                <p className="font-bold text-black/50 text-[7.5px] uppercase">CATEGORY</p>
                <p className="font-extrabold text-[9px] text-black">VIP 1</p>
              </div>
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
              <div>
                <p className="text-black/50 text-[7px] font-bold uppercase">DATE</p>
                <p className="font-extrabold text-[8.5px] text-black leading-none">06:00PM</p>
                <p className="font-extrabold text-[8.5px] text-black leading-none">12 APRIL 2025</p>
              </div>
              <div>
                <p className="text-black/50 text-[7px] font-bold uppercase">CATEGORY</p>
                <p className="font-extrabold text-[9px] text-black leading-none">VIP 1</p>
              </div>
            </div>
            <div className="w-full h-10 flex justify-between items-center px-1">
              {Array.from({ length: 22 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full bg-black ${
                    i % 5 === 0 ? 'w-[3px]' : i % 3 === 0 ? 'w-[2px]' : 'w-[1px]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bocchi;