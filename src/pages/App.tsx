import { useState } from 'react';
import Menu from './Menu';
import Scene from './Scene';
import Home from './Home';
import Seika from './characters/Seika';
import Kikuri from './characters/Kikuri';
import Hitori from './characters/Hitori';
import Nijika from './characters/Nijika';
import Ryo from './characters/Ryo';
import Kita from './characters/Kita';

const characterMap: Record<string, React.FC> = {
  seika: Seika,
  kikuri: Kikuri,
  hitori: Hitori,
  nijika: Nijika,
  ryo: Ryo,
  kita: Kita,
};

const App = () => {
  const [screen, setScreen] = useState<'menu' | 'scene' | 'character' | 'home'>('menu');
  const [characterName, setCharacterName] = useState<string>('');

  const CharacterPage = characterMap[characterName];

  return (
    <>
      {screen === 'menu' && (
        <Menu
          onStart={() => setScreen('scene')}
          onHome={() => setScreen('home')}
          onCharacter={(name) => {
            setCharacterName(name);
            setScreen('character');
          }}
        />
      )}
      {screen === 'scene' && (
        <Scene
          onCharacter={(name) => {
            setCharacterName(name);
            setScreen('character');
          }}
        />
      )}
      {screen === 'home' && <Home />}
      {screen === 'character' && CharacterPage && (
        <CharacterPage onBack={() => setScreen('scene')} />
      )}
    </>
  );
};

export default App;