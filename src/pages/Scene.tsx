import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const characters = [
  {
    name: 'Seika',
    src: '/img/seiki/seiki.png',
    tx: -60,
    ty: -80,
    w: 'w-20',
    dialog: 'Ada apa ini...?',
    z: 10,
    color: '#e65100',
    accentColor: '#fbbf24',
    role: 'MANAGER',
    jpName: '伊地知 星歌',
    noiseLevel: 'LOW',
  },
  {
    name: 'Kikuri',
    src: '/img/kikkuri/kikkuri.png',
    tx: 80,
    ty: -80,
    w: 'w-32',
    dialog: 'Minum dulu gak sih~',
    z: 3,
    color: '#9c27b0',
    accentColor: '#a3e635',
    role: 'BASSIST / SICK HACK',
    jpName: '廣井 きくり',
    noiseLevel: 'HIGH',
  },
  {
    name: 'Hitori',
    src: '/img/hitori/goto.png',
    tx: -360,
    ty: -72,
    w: 'w-39',
    dialog: 'A-Awas, j-jangan terlalu dekat!!',
    z: 3,
    color: '#ec4899',
    accentColor: '#22d3ee',
    role: 'GUITARIST',
    jpName: '後藤 ひとり',
    noiseLevel: 'UNKNOWN',
  },
  {
    name: 'Nijika',
    src: '/img/nijika/nijika.png',
    tx: 176,
    ty: -98,
    w: 'w-48',
    dialog: 'Semuanya, ayo latihan!',
    z: 3,
    color: '#eab308',
    accentColor: '#ef4444',
    role: 'DRUMMER / LEADER',
    jpName: '伊地知 虹夏',
    noiseLevel: 'MEDIUM',
  },
  {
    name: 'Ryo',
    src: '/img/ryo/ryo.png',
    tx: -720,
    ty: -96,
    w: 'w-84',
    dialog: 'Pinjam uang dong...',
    z: 10,
    color: '#3b82f6',
    accentColor: '#f43f5e',
    role: 'BASSIST',
    jpName: '山田 リョウ',
    noiseLevel: 'LOW',
  },
  {
    name: 'Kita',
    src: '/img/kita/kita.png',
    tx: 400,
    ty: -80,
    w: 'w-74',
    dialog: 'Kita-aan~',
    z: 3,
    color: '#ef4444',
    accentColor: '#4ade80',
    role: 'VOCAL & GUITARIST',
    jpName: '喜多 郁代',
    noiseLevel: 'MAX',
  },
];

const cameraTargets = [
  { scale: 3.2, x: 120, y: 240, scroll: 400 },    // 0: Seika
  { scale: 3.5, x: -280, y: 100, scroll: 1200 },  // 1: Kikuri
  { scale: 3.2, x: 380, y: -100, scroll: 2000 },  // 2: Hitori
  { scale: 2.8, x: -420, y: 0, scroll: 2800 },    // 3: Nijika
  { scale: 2.2, x: 660, y: -160, scroll: 3600 },  // 4: Ryo
  { scale: 2.4, x: -1000, y: -280, scroll: 4400 }, // 5: Kita
];

interface SceneProps {
  onCharacter?: (name: string) => void;
}

const Scene = ({ onCharacter }: SceneProps) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [, setIsZoomed] = useState<boolean>(false);
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const charWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const dialogBoxRef = useRef<HTMLDivElement>(null);
  const splashContainerRef = useRef<HTMLDivElement>(null);
  const speedLinesRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const letterboxTopRef = useRef<HTMLDivElement>(null);
  const letterboxBottomRef = useRef<HTMLDivElement>(null);

  const lenisRef = useRef<Lenis | null>(null);
  const cameraModeRef = useRef<'linear' | 'free'>('linear');
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const cameraTweenRef = useRef<gsap.core.Timeline | null>(null);
  const lastActiveIndexRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const triggerEpicEffects = useCallback(() => {
    if (speedLinesRef.current) {
      gsap.fromTo(
        speedLinesRef.current,
        { opacity: 0.85, scale: 1.2 },
        { opacity: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }

    if (flashOverlayRef.current) {
      gsap.fromTo(
        flashOverlayRef.current,
        { opacity: 0.6 },
        { opacity: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, []);

  const showDialog = useCallback(
    (index: number | null) => {
      setActiveCharIndex(index);
      if (index !== null) {
        triggerEpicEffects();

        gsap.to([letterboxTopRef.current, letterboxBottomRef.current], {
          height: '40px',
          duration: 0.3,
          ease: 'power3.out',
        });

        gsap.to(dialogBoxRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: 'back.out(1.5)',
          overwrite: true,
        });

        if (splashContainerRef.current) {
          gsap.fromTo(
            splashContainerRef.current.children,
            { scale: 0.2, opacity: 0, rotation: -45 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.45,
              stagger: 0.04,
              ease: 'power4.out',
              overwrite: true,
            }
          );
        }
      } else {
        gsap.to([letterboxTopRef.current, letterboxBottomRef.current], {
          height: '0px',
          duration: 0.3,
          ease: 'power2.in',
        });

        gsap.to(dialogBoxRef.current, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.2,
          ease: 'power2.in',
          overwrite: true,
        });
      }
    },
    [triggerEpicEffects]
  );

  const handleCharacterClick = (index: number) => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    const target = cameraTargets[index];

    if (!wrapper || !overlay || !target) return;

    if (cameraTweenRef.current) {
      cameraTweenRef.current.kill();
      cameraTweenRef.current = null;
    }

    cameraModeRef.current = 'free';
    setIsZoomed(true);

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.disable();
    }

    charWrapperRefs.current.forEach((el, idx) => {
      if (el) {
        gsap.set(el, {
          zIndex: idx === index ? 30 : characters[idx].z,
        });
      }
    });

    lastActiveIndexRef.current = index;
    showDialog(index);

    gsap.to(overlay, {
      opacity: 0.75,
      duration: 0.45,
      ease: 'power4.out',
      overwrite: true,
    });

    const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
    cameraTweenRef.current = timeline;

    timeline.to(wrapper, {
      scale: target.scale,
      x: target.x,
      y: target.y,
      duration: 0.45,
      ease: 'power4.out',
    });

    timeline.call(() => {
      if (!lenisRef.current) return;
      lenisRef.current.scrollTo(target.scroll, { duration: 0, immediate: true });
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.scroll(target.scroll);
        scrollTriggerRef.current.enable();
        scrollTriggerRef.current.update();
      }
      cameraModeRef.current = 'linear';
    });
  };

  const handleResetCamera = () => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !overlay) return;

    if (cameraTweenRef.current) {
      cameraTweenRef.current.kill();
      cameraTweenRef.current = null;
    }

    cameraModeRef.current = 'free';

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.disable();
    }

    lastActiveIndexRef.current = null;
    showDialog(null);

    const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
    cameraTweenRef.current = timeline;

    timeline
      .to(wrapper, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power4.inOut',
      })
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power4.inOut',
        },
        '<'
      );

    timeline.call(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 0, immediate: true });
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.scroll(0);
        scrollTriggerRef.current.enable();
        scrollTriggerRef.current.update();
      }
      charWrapperRefs.current.forEach((el, idx) => {
        if (el) gsap.set(el, { zIndex: characters[idx].z });
      });
      cameraModeRef.current = 'linear';
      setIsZoomed(false);
    });
  };

  // Entrance animation on mount — opacity 0→1, scale 1.05→1, blur 6px→0
  useEffect(() => {
    if (!sceneRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sceneRef.current,
        { opacity: 0, scale: 1.05, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out' }
      );
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      if (cameraModeRef.current === 'free') return;
      ScrollTrigger.update();
    });

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const scene = sceneRef.current;
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;

    if (scene && wrapper && overlay) {
      const seg = 800;
      const totalSteps = 6;

      gsap.set(wrapper, { transformOrigin: 'center center' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: `+=${seg * 7}`,
          scrub: 0.1,
          onUpdate: (self) => {
            if (cameraModeRef.current === 'free') return;

            const p = self.progress;

            if (p <= 0.05 || p >= 0.95) {
              if (lastActiveIndexRef.current !== null) {
                lastActiveIndexRef.current = null;
                setIsZoomed(false);
                showDialog(null);
                charWrapperRefs.current.forEach((el, idx) => {
                  if (el) gsap.set(el, { zIndex: characters[idx].z });
                });
              }
            } else {
              const activeIndex = Math.min(
                totalSteps - 1,
                Math.floor(((p - 0.05) / 0.85) * totalSteps)
              );

              if (lastActiveIndexRef.current !== activeIndex) {
                lastActiveIndexRef.current = activeIndex;
                setIsZoomed(true);
                showDialog(activeIndex);

                charWrapperRefs.current.forEach((el, idx) => {
                  if (el) {
                    gsap.set(el, {
                      zIndex: idx === activeIndex ? 30 : characters[idx].z,
                    });
                  }
                });
              }
            }
          },
        },
      });

      if (tl.scrollTrigger) {
        scrollTriggerRef.current = tl.scrollTrigger;
      }

      gsap.set(overlay, { opacity: 0 });
      gsap.set(dialogBoxRef.current, { opacity: 0, y: 30, scale: 0.95 });

      charWrapperRefs.current.forEach((charEl, idx) => {
        if (charEl) gsap.set(charEl, { zIndex: characters[idx].z });
      });

      tl.to(overlay, { opacity: 0.75, ease: 'power2.inOut', duration: 0.2 }, 0);

      cameraTargets.forEach((target, i) => {
        const stepTime = i;
        tl.to(
          wrapper,
          {
            scale: target.scale,
            x: target.x,
            y: target.y,
            ease: 'power3.out',
            duration: 0.45,
          },
          stepTime
        );
      });

      tl.to(
        wrapper,
        {
          scale: 1,
          x: 0,
          y: 0,
          ease: 'power3.inOut',
          duration: 0.6,
        },
        6
      ).to(
        overlay,
        {
          opacity: 0,
          ease: 'power3.inOut',
          duration: 0.6,
        },
        6
      );
    }

    window.addEventListener('mousemove', handleMouseMove);

    const handleWheel = () => {
      if (cameraModeRef.current !== 'free') return;

      if (cameraTweenRef.current) {
        cameraTweenRef.current.kill();
        cameraTweenRef.current = null;
      }

      cameraModeRef.current = 'linear';

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.enable();
      }

      ScrollTrigger.update();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      gsap.ticker.remove(updateLenis);
      if (cameraTweenRef.current) cameraTweenRef.current.kill();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [handleMouseMove, showDialog]);

  const activeChar = activeCharIndex !== null ? characters[activeCharIndex] : null;
  const themeColor = activeChar?.color || '#ef4444';
  const accentColor = activeChar?.accentColor || '#4ade80';

  return (
    <>
      <div style={{ height: 'calc(5600px + 100vh)' }} />

      {/* SCREEN FLASH IMPACT */}
      <div
        ref={flashOverlayRef}
        className="fixed inset-0 z-50 pointer-events-none opacity-0 mix-blend-screen"
        style={{ backgroundColor: accentColor }}
      />

      {/* ANIME SPEED LINES OVERLAY */}
      <div
        ref={speedLinesRef}
        className="fixed inset-0 z-40 pointer-events-none opacity-0 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at center, transparent 0, transparent 30%, rgba(255,255,255,0.4) 31%, transparent 33%)',
          backgroundSize: '100% 100%',
        }}
      />

      {/* CINEMATIC LETTERBOX BARS */}
      <div
        ref={letterboxTopRef}
        className="fixed top-0 left-0 right-0 z-50 bg-black h-0 pointer-events-none transition-all"
      />
      <div
        ref={letterboxBottomRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black h-0 pointer-events-none transition-all"
      />

      <div
        ref={sceneRef}
        className="fixed inset-0 h-screen overflow-hidden"
        style={{ perspective: 800 }}
      >
        <div
          ref={wrapperRef}
          className="w-full h-full origin-center relative"
          style={{ willChange: 'transform' }}
        >
          <img
            src="/img/background.jpg"
            alt=""
            className="w-full h-screen object-cover z-1 pointer-events-none"
            loading="eager" decoding="sync" fetchPriority="high"
          />

          <img
            src="/img/chairtable.png"
            alt=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-screen object-cover z-2 pointer-events-none"
            loading="eager" decoding="sync" fetchPriority="high"
          />

          <img
            src="/img/chairtablefront.png"
            alt=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-screen object-cover z-4 pointer-events-none"
            loading="eager" decoding="sync" fetchPriority="high"
          />

          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black pointer-events-none z-20"
          />

          {characters.map((char, i) => {
            const img = imgRefs.current[i];
            let rotateY = 0;

            if (img && mouseX !== null) {
              const rect = img.getBoundingClientRect();
              const center = rect.left + rect.width / 2;
              rotateY = Math.max(-30, Math.min(30, (mouseX - center) / 8));
            }

            return (
              <div
                key={i}
                ref={(el) => {
                  charWrapperRefs.current[i] = el;
                }}
                onClick={() => handleCharacterClick(i)}
                className="absolute top-1/2 left-1/2 cursor-pointer transition-transform duration-200 pointer-events-auto"
                style={{
                  transform: `translate(${char.tx}px, ${char.ty}px)`,
                  zIndex: 10,
                }}
              >
                <img
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  src={char.src}
                  alt={char.name}
                  className={`${char.w} pointer-events-auto select-none`}
                  loading="eager" decoding="sync" fetchPriority="high"
                  draggable={false}
                  style={{
                    transform: `rotateY(${rotateY}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* FULL-SCREEN OVERLAY Y2K / PUNK GRAPHICS & DIALOGUE UI */}
        <div
          ref={dialogBoxRef}
          className="fixed inset-0 z-50 pointer-events-none opacity-0 select-none font-sans flex flex-col justify-end p-4 sm:p-8"
        >
          {/* SPREADING SPLASHES & GRAPHIC SHARDS */}
          <div
            ref={splashContainerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          >
            {/* 1. Spiky Burst Kiri Bawah */}
            <svg
              viewBox="0 0 500 500"
              className="absolute -bottom-44 -left-44 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] opacity-75"
            >
              <path
                d="M250 20 L290 140 L440 60 L350 190 L490 240 L340 280 L420 420 L280 340 L200 480 L210 330 L50 370 L150 260 L10 200 L160 190 Z"
                fill={accentColor}
                className="opacity-70 transition-colors duration-300"
              />
              <path
                d="M250 40 L280 150 L410 80 L330 200 L460 250 L320 290 L380 400 L270 330 L190 450 L200 320 L70 350 L140 250 L30 190 L150 180 Z"
                fill={themeColor}
                className="transition-colors duration-300"
              />
              <path
                d="M380 100 L386 125 L411 131 L386 137 L380 162 L374 137 L349 131 L374 125 Z"
                fill="#ffffff"
              />
              <path
                d="M120 120 L124 140 L144 144 L124 148 L120 168 L116 148 L96 144 L116 140 Z"
                fill="#ffffff"
              />
            </svg>

            {/* 2. Sharp Speed Shards */}
            <svg
              viewBox="0 0 400 400"
              className="absolute bottom-24 right-0 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px]"
            >
              <path
                d="M50 400 L400 0 L400 150 L180 400 Z"
                fill={accentColor}
                className="opacity-40 transition-colors duration-300"
              />
              <path
                d="M0 400 L400 80 L400 220 L120 400 Z"
                fill={themeColor}
                className="opacity-80 transition-colors duration-300"
              />
              <path
                d="M220 350 L380 120 L400 280 Z"
                fill="#ffffff"
                className="opacity-30"
              />
            </svg>

            {/* Floating Kanji Text Raksasa */}
            <div className="absolute left-1/2 -translate-x-1/2 top-16 pointer-events-none select-none opacity-25 font-black text-7xl md:text-9xl text-white transform -rotate-3 font-mono tracking-tighter whitespace-nowrap">
              {activeChar?.jpName || ''}
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10">
            {/* HEADER TAG NAMA + ROLE + CUTOUT BADGES */}
            <div className="flex flex-wrap items-center gap-3 mb-[-12px] relative z-20 pl-4 sm:pl-8">
              <div
                className="inline-flex items-center gap-4 text-white font-black text-2xl sm:text-3xl px-8 py-3 tracking-widest uppercase transform -skew-x-12 transition-all duration-300 border-4 border-black"
                style={{
                  backgroundColor: themeColor,
                  boxShadow: `8px 8px 0px #000000, 0 0 20px ${themeColor}aa`,
                }}
              >
                <span className="inline-block transform skew-x-12 font-mono drop-shadow-[2px_2px_0px_#000]">
                  {activeChar?.name || ''}
                </span>
              </div>

              <div
                className="inline-block text-black font-black text-xs sm:text-sm px-4 py-2 tracking-widest uppercase transform skew-x-6 border-2 border-black transition-colors duration-300 shadow-[4px_4px_0px_#000]"
                style={{ backgroundColor: accentColor }}
              >
                {activeChar?.role || ''}
              </div>

              <div className="bg-yellow-400 text-black font-mono font-black text-[10px] px-3 py-1 transform -rotate-6 border border-black shadow-[3px_3px_0px_#000] uppercase">
                ⚠ NOISE_LEVEL: {activeChar?.noiseLevel || 'LOW'}
              </div>
            </div>

            {/* CONTAINER DIALOG UTAMA */}
            <div
              className="relative bg-neutral-950/95 backdrop-blur-md text-white px-8 sm:px-12 py-8 border-4 border-black transition-all duration-300 overflow-hidden"
              style={{
                boxShadow: `12px 12px 0px #000000, 0 0 40px ${themeColor}66`,
                clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0 100%)',
              }}
            >
              <div
                className="absolute inset-0 border-2 pointer-events-none transition-colors duration-300"
                style={{ borderColor: themeColor }}
              />

              <div
                className="absolute top-0 left-0 right-0 h-2 opacity-90"
                style={{
                  backgroundImage: `repeating-linear-gradient(-45deg, ${themeColor}, ${themeColor} 12px, #000000 12px, #000000 24px)`,
                }}
              />

              <div
                className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #ffffff 2px, transparent 2px)',
                  backgroundSize: '12px 12px',
                }}
              />

              <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono tracking-[0.3em] opacity-60 uppercase mb-4 pt-1">
                <span className="flex items-center gap-2 font-bold" style={{ color: accentColor }}>
                  ► KESSOKU BAND
                </span>
                <span>CH_ID // 0{activeCharIndex !== null ? activeCharIndex + 1 : 0}</span>
              </div>

              <div className="relative z-10 flex items-start gap-3 sm:gap-6 pr-12 sm:pr-48">
                <span
                  className="text-5xl sm:text-6xl font-black font-mono leading-none transition-colors duration-300"
                  style={{ color: accentColor }}
                >
                  “
                </span>
                <p className="text-2xl sm:text-4xl font-black tracking-wide leading-relaxed text-white font-mono drop-shadow-[2px_2px_0px_#000]">
                  {activeChar?.dialog || ''}
                </p>
                <span
                  className="text-5xl sm:text-6xl font-black font-mono leading-none self-end transition-colors duration-300"
                  style={{ color: accentColor }}
                >
                  ”
                </span>
              </div>

              {/* ACTION BUTTONS & BARCODE */}
              <div className="absolute bottom-4 right-8 flex items-center gap-3 z-10">
                <div className="h-7 w-16 sm:w-20 hidden xs:flex justify-between items-center bg-black/60 p-1 border border-white/30 shadow-[3px_3px_0px_#000]">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full bg-white"
                      style={{ width: i % 3 === 0 ? '3px' : '1px' }}
                    />
                  ))}
                </div>

                {/* TOMBOL MORE / SELENGKAPNYA DENGAN TRANSISI ANIMASI KELUAR */}
                {activeChar && (
                  <button
                    onClick={() => {
                      if (onCharacter) {
                        gsap.to(sceneRef.current, {
                          scale: 2.5,
                          opacity: 0,
                          filter: 'blur(10px)',
                          duration: 0.5,
                          ease: 'power3.in',
                          onComplete: () => {
                            onCharacter(activeChar.name.toLowerCase());
                          },
                        });
                      }
                    }}
                    title="Lihat Detail Karakter"
                    className="px-4 h-8 border-2 border-black flex items-center justify-center text-white font-black font-mono text-xs tracking-wider uppercase transition-all duration-200 shadow-[4px_4px_0px_#000] hover:scale-105 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] cursor-pointer pointer-events-auto"
                    style={{ backgroundColor: themeColor }}
                  >
                    MORE ▶
                  </button>
                )}

                {/* TOMBOL KEMBALI / RESET CAMERA */}
                <button
                  onClick={handleResetCamera}
                  title="Kembali"
                  className="w-8 h-8 border-2 border-black flex items-center justify-center text-black font-black transition-all duration-200 shadow-[4px_4px_0px_#000] hover:scale-110 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] cursor-pointer pointer-events-auto"
                  style={{ backgroundColor: accentColor }}
                >
                  <svg
                    className="w-5 h-5 transform -rotate-45 stroke-current"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scene;