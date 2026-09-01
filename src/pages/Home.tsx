import Photocard from '../components/Photocard';

const Home = () => {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden select-none">
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="font-mono font-black tracking-[0.3em] text-4xl sm:text-5xl text-white/90">
          BOCCHI
        </h1>
        <p className="font-mono tracking-[0.5em] text-sm text-white/50">
          ★ L I V E H O U S E ★
        </p>

        <Photocard />
      </div>
    </div>
  );
};

export default Home;
