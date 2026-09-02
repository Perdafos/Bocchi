import React, { useEffect, useState } from 'react';
import { usePreloader } from '../context/PreloaderContext';

interface LoadingScreenProps {
  onEnter?: () => void;
}

// ─────────────────────────────────────────────
// Character Hair Color Diagonal Stripes Background
// ─────────────────────────────────────────────
const CharacterStripesBg: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
    <div 
      className="absolute inset-[-50%] flex"
      style={{ transform: 'rotate(-20deg) scale(1.4)' }}
    >
      <div className="w-1/4 h-full bg-[#f472b6]" /> {/* Bocchi Pink */}
      <div className="w-1/4 h-full bg-[#facc15]" /> {/* Nijika Yellow */}
      <div className="w-1/4 h-full bg-[#38bdf8]" /> {/* Ryo Blue */}
      <div className="w-1/4 h-full bg-[#f43f5e]" /> {/* Kita Red */}
    </div>
  </div>
);

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onEnter }) => {
  const { progress, isComplete, startPreload } = usePreloader();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    startPreload();
  }, []);

  // Otomatis masuk ke web begitu preloading 100% selesai
  useEffect(() => {
    if (isComplete) {
      setExiting(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onEnter?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onEnter]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-black select-none
        transition-opacity duration-500 ease-in-out flex items-center justify-center
        ${exiting ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Background Warna-Warni Karakter Tanpa Overlay */}
      <CharacterStripesBg />

      {/* Animasi Loading Murni di Tengah */}
      <div className="relative z-20 flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="font-mono text-white text-xs tracking-[0.3em] uppercase drop-shadow-md">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;