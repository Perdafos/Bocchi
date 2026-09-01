import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Kikuri = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Placeholder for future animation
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="fixed inset-0 bg-[#1B1B1A]"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            rgba(128,128,128,0.08) 0px,
            rgba(128,128,128,0.08) 1px,
            transparent 1px,
            transparent 1fr
          ),
          repeating-linear-gradient(
            90deg,
            rgba(128,128,128,0.08) 0px,
            rgba(128,128,128,0.08) 1px,
            transparent 1px,
            transparent 1fr
          )
        `,
        backgroundSize: 'calc(100% / 100) calc(100% / 100)',
      }}
    />
  );
};

export default Kikuri;
