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

  // Stable callbacks — must be declared above any conditional return
  // to satisfy Rules of Hooks.
  const handleHidden = useCallback(() => {
    // Overlay has finished fading out; nothing extra needed.
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
          <Scene
            onCharacter={(name) => {
              // 1. Show white overlay first
              setIsTransitioning(true);
              // 2. Defer character mount by a frame so overlay is visibly
              //    closing in before the heavy render begins
              requestAnimationFrame(() => {
                setCharacterName(name);
              });
            }}
          />
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
