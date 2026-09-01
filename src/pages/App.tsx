import { useState } from 'react';
import Menu from './Menu';
import Scene from './Scene';

const App = () => {
  const [screen, setScreen] = useState<'menu' | 'scene'>('menu');

  return (
    <>
      {screen === 'menu' && <Menu onStart={() => setScreen('scene')} />}
      {screen === 'scene' && <Scene />}
    </>
  );
};

export default App;
