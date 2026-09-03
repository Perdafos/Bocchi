import { StrictMode, useState, useEffect } from 'react';
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
// Inner app — App tidak mount sampai preload selesai
// ─────────────────────────────────────────────
const AppWithPreloader: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  const [characterName, setCharacterName] = useState<string>('');
  const { isComplete, markReady } = usePreloader();

  const CharacterPage = characterMap[characterName];

  // App boleh mount + animate in setelah preload 100%
  useEffect(() => {
    if (!isComplete) return;
    markReady();
    setShowApp(true);
  }, [isComplete, markReady]);

  // App TIDAK mount sama sekali sebelum preload selesai
  if (!isComplete) {
    return <LoadingScreen />;
  }

  // ShowApp false = animasi fade-in; true = fully visible
  return (
    <div
      className="transition-opacity duration-500"
      style={{
        opacity: showApp ? 1 : 0,
        pointerEvents: showApp ? 'auto' : 'none',
      }}
    >
      {characterName ? (
        CharacterPage && <CharacterPage onBack={() => setCharacterName('')} />
      ) : (
        <Scene onCharacter={(name) => setCharacterName(name)} />
      )}
    </div>
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
