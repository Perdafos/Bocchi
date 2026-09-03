import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * Encapsulates entrance + exit animation for character detail pages.
 * Returns isExiting (prevents double-click) and handleBackClick (exit anim then onBack).
 * Call setupEntrance(ref) inside a useEffect with the character section ref.
 *
 * @param onBack          — called when exit animation completes.
 * @param onReady         — called once after the entrance animation begins (before it ends),
 *                          signalling that the character page is mounted and visible.
 */
export function useCharacterPageTransition(
  onBack: () => void,
  onReady?: () => void
) {
  const [isExiting, setIsExiting] = useState(false);
  const readyFiredRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Entrance animation — call once on mount via useEffect
  const setupEntrance = useCallback(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Explicitly set initial state so GSAP detects a change and fires onStart
      gsap.set(sectionRef.current, { opacity: 0, scale: 0.92, filter: 'blur(8px)' });
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, scale: 0.92, filter: 'blur(8px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power3.out',
          onStart: () => {
            // Fire once the instant the entrance starts — DOM is mounted
            if (!readyFiredRef.current) {
              readyFiredRef.current = true;
              onReady?.();
            }
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [onReady]);

  // Exit animation + call onBack when done
  const handleBackClick = useCallback(() => {
    if (isExiting || !sectionRef.current) return;
    setIsExiting(true);
    readyFiredRef.current = false;

    gsap.to(sectionRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        onBack();
      },
    });
  }, [isExiting, onBack]);

  return {
    sectionRef,
    isExiting,
    setupEntrance,
    handleBackClick,
  };
}
