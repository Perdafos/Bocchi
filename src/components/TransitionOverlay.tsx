import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface TransitionOverlayProps {
  isVisible: boolean;
  onFullyOpaque: () => void; // fired once when overlay is fully white (time to mount character)
  onHidden: () => void;       // fired once when fade-out completes
}

const FADE_IN_MS = 0.3;
const HOLD_MS    = 0.15;
const FADE_OUT_MS = 0.4;

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  isVisible,
  onFullyOpaque,
  onHidden,
}) => {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const opaqueFired = useRef(false);
  const hiddenFired = useRef(false);

  // Reset flags when hidden so next appearance fires correctly
  useEffect(() => {
    if (!isVisible) {
      opaqueFired.current = false;
      hiddenFired.current = false;
    }
  }, [isVisible]);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (isVisible) {
      // ── Fade IN ──────────────────────────────────────────────
      gsap.set(el, { display: 'block' });
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: FADE_IN_MS,
          ease: 'power2.inOut',
          onComplete: () => {
            if (!opaqueFired.current) {
              opaqueFired.current = true;
              // Brief hold at full white, then signal caller
              setTimeout(onFullyOpaque, HOLD_MS * 1000);
            }
          },
        }
      );
    } else {
      // ── Fade OUT ─────────────────────────────────────────────
      gsap.to(el, {
        opacity: 0,
        duration: FADE_OUT_MS,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(el, { display: 'none' });
          if (!hiddenFired.current) {
            hiddenFired.current = true;
            onHidden();
          }
        },
      });
    }
  }, [isVisible, onFullyOpaque, onHidden]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-white pointer-events-none"
      style={{ display: 'none', opacity: 0 }}
      aria-hidden="true"
    />
  );
};

export default TransitionOverlay;
