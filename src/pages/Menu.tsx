import { useEffect, useRef, useState } from 'react';

type MenuItem = {
  label: string;
  action: 'start' | 'characters' | 'settings' | 'quit';
};

const menuItems: MenuItem[] = [
  { label: 'MULAI', action: 'start' },
  { label: 'KARAKTER', action: 'characters' },
  { label: 'PENGATURAN', action: 'settings' },
  { label: 'KELUAR', action: 'quit' },
];

const Menu = ({ onStart }: { onStart: () => void }) => {
  const [selected, setSelected] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activate = (action: MenuItem['action']) => {
    if (leaving) return;
    if (action === 'start') {
      setLeaving(true);
      // beri waktu animasi zoom + fade-out sebelum masuk scene
      window.setTimeout(() => onStart(), 700);
    } else if (action === 'quit') {
      setLeaving(true);
      window.setTimeout(() => {
        // browser biasanya blokir window.close() untuk tab bukan hasil script
        window.open('', '_self');
        window.close();
      }, 700);
    } else {
      // placeholder karakter / pengaturan
      alert(
        action === 'characters'
          ? 'Karakter — fitur belum tersedia 🎸'
          : 'Pengaturan — fitur belum tersedia ⚙️'
      );
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (leaving) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => (s + 1) % menuItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => (s - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(menuItems[selected].action);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, leaving]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 h-screen w-screen overflow-hidden bg-black text-white select-none transition-all duration-700 ease-in-out ${
        leaving
          ? 'opacity-0 scale-150 blur-sm'
          : 'opacity-100 scale-100 blur-0'
      }`}
    >
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes floatTitle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background starry */}
      <img
        src="/img/starry.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Dark vignette overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Twinkling stars (decorative dots) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {Array.from({ length: 28 }).map((_, i) => {
          const top = (i * 37) % 100;
          const left = (i * 53) % 100;
          const delay = (i % 7) * 0.4;
          const size = 2 + (i % 3);
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: size,
                height: size,
                animation: `twinkle 3s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6">
        {/* Title */}
        <h1
          className="font-mono font-black tracking-[0.3em] text-6xl sm:text-7xl md:text-8xl text-center"
          style={{
            color: '#7df9ff',
            textShadow:
              '0 0 12px #7df9ff, 0 0 28px #00d4ff, 0 0 48px #0066ff',
            animation: 'dropIn 0.9s ease-out, floatTitle 5s ease-in-out 1s infinite',
          }}
        >
          BOCCHI
        </h1>
        <p
          className="mt-4 font-mono tracking-[0.5em] text-sm sm:text-base text-fuchsia-300"
          style={{ textShadow: '0 0 10px #f0abfc' }}
        >
          ★ L I V E  H O U S E ★
        </p>

        {/* Menu list */}
        <nav className="mt-16 flex flex-col items-center gap-3 sm:gap-4">
          {menuItems.map((item, i) => {
            const active = i === selected;
            return (
              <button
                key={item.label}
                onMouseEnter={() => setSelected(i)}
                onClick={() => activate(item.action)}
                className={`group relative font-mono font-bold tracking-[0.25em] text-lg sm:text-2xl px-8 py-2 transition-all duration-200 ${
                  active
                    ? 'text-white scale-110'
                    : 'text-white/50 hover:text-white/80'
                }`}
                style={{
                  animation: 'fadeUp 0.6s ease-out both',
                  animationDelay: `${0.3 + i * 0.12}s`,
                  filter: active
                    ? 'drop-shadow(0 0 10px #7df9ff) drop-shadow(0 0 20px #00d4ff)'
                    : 'none',
                }}
              >
                <span
                  className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 text-cyan-300 transition-all duration-200 ${
                    active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                  style={{ textShadow: '0 0 10px #7df9ff' }}
                >
                  ▶
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <p className="absolute bottom-6 font-mono text-[10px] sm:text-xs text-white/40 tracking-widest">
          ↑ ↓ PILIH &nbsp;·&nbsp; ENTER / SPASI &nbsp;·&nbsp; MOUSE
        </p>
      </div>
    </div>
  );
};

export default Menu;
