import { StrictMode, useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { PreloaderProvider, usePreloader } from './context/PreloaderContext';
import LoadingScreen from './components/LoadingScreen';
import { assetManifest } from './config/assetManifest';
import Scene from './pages/Scene';
import Seika from './pages/characters/Seika';
import Kikuri from './pages/characters/Kikuri';
import Hitori from './pages/characters/Bocchi';
import Nijika from './pages/characters/Nijika';
import Ryo from './pages/characters/Ryo';
import Kita from './pages/characters/Kita';

const characterMap: Record<string, React.FC<{ onBack: () => void }>> = {
  seika: Seika,
  kikuri: Kikuri,
  hitori: Hitori,
  nijika: Nijika,
  ryo: Ryo,
  kita: Kita,
};

// ─────────────────────────────────────────────
// Inner app — langsung ke Scene, skip Menu
// ─────────────────────────────────────────────
const AppWithPreloader: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  const [characterName, setCharacterName] = useState<string>('');
  const { isComplete, markReady } = usePreloader();

  const CharacterPage = characterMap[characterName];

  // Mark ready setelah komponen mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      markReady();
      setShowApp(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [markReady]);

  const handleEnterApp = useCallback(() => {
    setShowApp(true);
  }, []);

  const handleCharacter = useCallback((name: string) => {
    setCharacterName(name);
  }, []);

  const handleBackToScene = useCallback(() => {
    setCharacterName('');
  }, []);

  return (
    <>
      <LoadingScreen onEnter={handleEnterApp} />

      <div
        className="transition-opacity duration-500"
        style={{
          opacity: showApp ? 1 : 0,
          pointerEvents: showApp ? 'auto' : 'none',
        }}
      >
        {characterName ? (
          CharacterPage && <CharacterPage onBack={handleBackToScene} />
        ) : (
          <Scene onCharacter={handleCharacter} />
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
    </PreloaderProvider>
  </StrictMode>,
);
