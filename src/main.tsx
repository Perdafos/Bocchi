import { StrictMode, useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { PreloaderProvider, usePreloader } from './context/PreloaderContext';
import LoadingScreen from './components/LoadingScreen';
import TransitionOverlay from './components/TransitionOverlay';
import { assetManifest } from './config/assetManifest';
import Scene from './pages/Scene';
import Seika from './pages/characters/Seika';
import Kikuri from './pages/characters/Kikuri';
import Hitori from './pages/characters/Bocchi';
import Nijika from './pages/characters/Nijika';
import Ryo from './pages/characters/Ryo';
import Kita from './pages/characters/Kita';
import MusicPlayer from './components/MusicPlayer';

const characterMap: Record<string, React.FC<{ onBack: () => void; onReady?: () => void }>> = {
  seika: Seika,
  kikuri: Kikuri,
  hitori: Hitori,
  nijika: Nijika,
  ryo: Ryo,
  kita: Kita,
};

// ─────────────────────────────────────────────
// Inner app — App tidak mount sampai preload selesai
// ─────────────────────────────────────────────
const AppWithPreloader: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  const [characterName, setCharacterName] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isComplete, markReady } = usePreloader();

  const CharacterPage = characterMap[characterName];

  // App boleh mount + animate in setelah preload 100%
  useEffect(() => {
    if (!isComplete) return;
    markReady();
    setShowApp(true);
  }, [isComplete, markReady]);

  const handleHidden = useCallback(() => {
    // Overlay has finished fading out
  }, []);

  const handleCharacterReady = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  // App TIDAK mount sama sekali sebelum preload selesai
  if (!isComplete) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TransitionOverlay
        isVisible={isTransitioning}
        onFullyOpaque={() => {}}
        onHidden={handleHidden}
      />

      <div
        className="transition-opacity duration-500"
        style={{
          opacity: showApp && !isTransitioning ? 1 : 0,
          pointerEvents: showApp && !isTransitioning ? 'auto' : 'none',
        }}
      >
        {characterName ? (
          CharacterPage && (
            <CharacterPage
              onBack={() => setCharacterName('')}
              onReady={handleCharacterReady}
            />
          )
        ) : (
          <div className="relative w-full h-screen overflow-hidden">
            {/* --- OPTION 3: MINIMAL SOFT VIGNETTE & RIM LIGHT --- */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              {/* Simple Smooth Vignette */}
              <div
                className="absolute inset-0 mix-blend-multiply opacity-85"
                style={{
                  background: `radial-gradient(circle at 50% 45%, transparent 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.9) 100%)`,
                }}
              />

              {/* Subtle Top Overhead Light Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-48 mix-blend-screen opacity-25"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)',
                  filter: 'blur(10px)',
                }}
              />
            </div>

            {/* Main Interactive Scene Component */}
            <Scene
              onCharacter={(name) => {
                // 1. Show white overlay first
                setIsTransitioning(true);
                // 2. Defer character mount by a frame
                requestAnimationFrame(() => {
                  setCharacterName(name);
                });
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

// ─────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreloaderProvider
      minDisplayTime={0}
      assetManifest={assetManifest}
    >
      <AppWithPreloader />
      <MusicPlayer />
    </PreloaderProvider>
  </StrictMode>,
);