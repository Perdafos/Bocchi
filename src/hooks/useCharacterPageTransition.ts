import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * Encapsulates entrance + exit animation for character detail pages.
 * Returns isExiting (prevents double-click) and handleBackClick (exit anim then onBack).
 * Call setupEntrance(ref) inside a useEffect with the character section ref.
 */
export function useCharacterPageTransition(onBack: () => void) {
  const [isExiting, setIsExiting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Entrance animation — call once on mount via useEffect
  const setupEntrance = useCallback(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, scale: 0.92, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Exit animation + call onBack when done
  const handleBackClick = useCallback(() => {
    if (isExiting || !sectionRef.current) return;
    setIsExiting(true);

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
