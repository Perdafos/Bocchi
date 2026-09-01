import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);


const characters = [
  {
    name: 'Seika',
    src: '/img/seiki.png',
    tx: -60,
    ty: -80,
    w: 'w-20',
    dialog: 'Ada apa ini...?',
    align: 'left',
    bubbleWidth: 'w-36',
    z: 10,
  },
  {
    name: 'Kikuri',
    src: '/img/kikkuri.png',
    tx: 80,
    ty: -80,
    w: 'w-32',
    dialog: 'Minum dulu gak sih~',
    align: 'left',
    bubbleWidth: 'w-44',
    z: 3,
  },
  {
    name: 'Hitori',
    src: '/img/goto.png',
    tx: -360,
    ty: -72,
    w: 'w-39',
    dialog: 'A-Awas, j-jangan terlalu dekat!!',
    align: 'right',
    bubbleWidth: 'w-52',
    z: 10,
  },
  {
    name: 'Nijika',
    src: '/img/nijika.png',
    tx: 176,
    ty: -98,
    w: 'w-48',
    dialog: 'Semuanya, ayo latihan!',
    align: 'left',
    bubbleWidth: 'w-44',
    z: 3,
  },
  {
    name: 'Ryo',
    src: '/img/ryo.png',
    tx: -720,
    ty: -96,
    w: 'w-84',
    dialog: 'Pinjam uang dong...',
    align: 'right',
    bubbleWidth: 'w-40',
    z: 10,
  },
  {
    name: 'Kita',
    src: '/img/kita.png',
    tx: 400,
    ty: -80,
    w: 'w-74',
    dialog: 'Kita-aan~',
    align: 'left',
    bubbleWidth: 'w-36',
    z: 10,
  },
];

// ============================================================
// CAMERA TARGETS
// ============================================================

const cameraTargets = [
  { scale: 4, x: 160, y: 320, scroll: 400 },
  { scale: 5, x: -420, y: 240, scroll: 1200 },
  { scale: 4, x: 680, y: 144, scroll: 2000 },
  { scale: 3, x: -480, y: -14, scroll: 2800 },
  { scale: 2, x: 580, y: 20, scroll: 3600 },
  { scale: 2.6, x: -950, y: -200, scroll: 4400 },
];

const Scene = () => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const charWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);

  const cameraModeRef = useRef<'linear' | 'free'>('linear');
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const cameraTweenRef = useRef<gsap.core.Timeline | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  // ==========================================================
  // UPDATE BUBBLE POSITION
  // ==========================================================
  const updateAllBubbles = useCallback(() => {
    imgRefs.current.forEach((img, i) => {
      const bubble = bubbleRefs.current[i];
      if (!img || !bubble) return;

      const rect = img.getBoundingClientRect();
      const align = characters[i].align;

      const top = rect.top - 50 + (i === 5 ? 100 : 0);
      const left = align === 'right' ? rect.right - 40 : rect.left - 100;

      gsap.set(bubble, {
        top: `${top}px`,
        left: `${left}px`,
      });
    });
  }, []);

  // ==========================================================
  // CLICK CHARACTER (DIRECT FLY TO TARGET)
  // ==========================================================
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

    bubbleRefs.current.forEach((bubble, idx) => {
      if (bubble && idx !== index) {
        gsap.to(bubble, {
          scale: 0,
          opacity: 0,
          duration: 0.15,
          ease: 'power2.in',
          overwrite: true,
        });
      }
    });

    gsap.to(overlay, {
      opacity: 0.7,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: true,
    });

    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
    });
    cameraTweenRef.current = timeline;

    timeline.to(wrapper, {
      scale: target.scale,
      x: target.x,
      y: target.y,
      duration: 1.1,
      ease: 'power3.inOut',
      onUpdate: updateAllBubbles,
    });

    timeline.to(
      bubbleRefs.current[index],
      {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'back.out(1.7)',
      },
      '-=0.3'
    );

    timeline.call(() => {
      if (!lenisRef.current) return;

      lenisRef.current.scrollTo(target.scroll, {
        duration: 0,
        immediate: true,
      });

      cameraModeRef.current = 'linear';

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.enable();
        scrollTriggerRef.current.update();
      }

      updateAllBubbles();
    });
  };

  // ==========================================================
  // RESET CAMERA TO INITIAL POSITION
  // ==========================================================
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

    // Sembunyikan seluruh bubble dialog
    bubbleRefs.current.forEach((bubble) => {
      if (bubble) {
        gsap.to(bubble, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          overwrite: true,
        });
      }
    });

    // Animasikan kamera kembali ke posisi awal (Zoom Out)
    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
    });
    cameraTweenRef.current = timeline;

    timeline
      .to(wrapper, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power3.inOut',
        onUpdate: updateAllBubbles,
      })
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        '<'
      );

    timeline.call(() => {
      // Reset scroll posisi Lenis ke paling atas (0)
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, {
          duration: 0,
          immediate: true,
        });
      }

      // Reset Z-Index seluruh karakter ke nilai awal
      charWrapperRefs.current.forEach((el, idx) => {
        if (el) gsap.set(el, { zIndex: characters[idx].z });
      });

      cameraModeRef.current = 'linear';
      setIsZoomed(false);

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.enable();
        scrollTriggerRef.current.update();
      }
    });
  };

  // ==========================================================
  // MAIN EFFECT
  // ==========================================================
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

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

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
          scrub: 0.5,
          onUpdate: (self) => {
            if (cameraModeRef.current === 'free') return;

            updateAllBubbles();

            const p = self.progress;

            // Update status state isZoomed berdasarkan posisi scroll progress
            if (p > 0.05 && p < 0.95) {
              setIsZoomed(true);
            } else {
              setIsZoomed(false);
            }

            if (p <= 0 || p >= 0.95) {
              charWrapperRefs.current.forEach((el, idx) => {
                if (el) gsap.set(el, { zIndex: characters[idx].z });
              });
            } else {
              const activeIndex = Math.min(
                totalSteps - 1,
                Math.floor((p / 0.85) * totalSteps)
              );

              charWrapperRefs.current.forEach((el, idx) => {
                if (el) {
                  gsap.set(el, {
                    zIndex: idx === activeIndex ? 30 : characters[idx].z,
                  });
                }
              });
            }
          },
        },
      });

      if (tl.scrollTrigger) {
        scrollTriggerRef.current = tl.scrollTrigger;
      }

      gsap.set(overlay, { opacity: 0 });
      bubbleRefs.current.forEach((bubble) => {
        if (bubble) gsap.set(bubble, { scale: 0, opacity: 0 });
      });

      charWrapperRefs.current.forEach((charEl, idx) => {
        if (charEl) gsap.set(charEl, { zIndex: characters[idx].z });
      });

      tl.to(overlay, { opacity: 0.7, ease: 'power1.inOut', duration: 0.3 }, 0);

      cameraTargets.forEach((target, i) => {
        const stepTime = i;

        tl.to(
          wrapper,
          {
            scale: target.scale,
            x: target.x,
            y: target.y,
            ease: 'power1.inOut',
            duration: 0.5,
          },
          stepTime
        )
          .to(
            bubbleRefs.current[i],
            {
              scale: 1,
              opacity: 1,
              ease: 'back.out(1.7)',
              duration: 0.3,
            },
            stepTime
          )
          .to(
            bubbleRefs.current[i],
            {
              scale: 0,
              opacity: 0,
              duration: 0.2,
            },
            stepTime + 0.8
          );
      });

      tl.to(
        wrapper,
        {
          scale: 1,
          x: 0,
          y: 0,
          ease: 'power1.inOut',
          duration: 1,
        },
        6
      ).to(
        overlay,
        {
          opacity: 0,
          ease: 'power1.inOut',
          duration: 1,
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
      if (cameraTweenRef.current) cameraTweenRef.current.kill();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [handleMouseMove, updateAllBubbles]);

  return (
    <>
      <div style={{ height: 'calc(5600px + 100vh)' }} />

      {/* TOMBOL RESET / KEMBALI */}
      <button
        onClick={handleResetCamera}
        className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-2.5 bg-black/80 hover:bg-black text-white text-sm font-bold tracking-wider rounded-full border border-white/20 shadow-lg backdrop-blur-md transition-all duration-300 transform ${
          isZoomed
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
        Kembali
      </button>

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
          />

          <img
            src="/img/chairtable.png"
            alt=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-screen object-cover z-2 pointer-events-none"
          />

          <img
            src="/img/chairtablefront.png"
            alt=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-screen object-cover z-4 pointer-events-none"
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

        {/* BUBBLE CHAT */}
        <div className="fixed inset-0 z-50 pointer-events-none">
          {characters.map((char, i) => {
            const isRight = char.align === 'right';
            const tailClass = isRight
              ? `absolute -bottom-2 left-4 w-0 h-0 border-l-[8px] border-l-transparent border-t-[10px] border-t-black border-r-[8px] border-r-transparent`
              : `absolute -bottom-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-t-[10px] border-t-black border-r-[8px] border-r-transparent`;

            return (
              <div
                key={i}
                ref={(el) => {
                  bubbleRefs.current[i] = el;
                }}
                className={`fixed ${char.bubbleWidth} select-none`}
                style={{
                  transformOrigin: isRight ? 'bottom left' : 'bottom right',
                }}
              >
                <div className="relative flex items-center justify-center p-3 bg-black text-white font-bold text-xs italic tracking-wider rounded-sm shadow-2xl transform -rotate-3 border-2 border-white">
                  <span className="relative z-10 text-center leading-snug break-words">
                    {char.dialog}
                  </span>
                  <div className={tailClass} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Scene;