import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

// Atur kerenggangan/kerapatan teks judul untuk SETIAP TRACK di sini secara bebas
const tracks = [
  { name: '青春コンプレックス', src: '/music/1. 青春コンプレックス.mp3', letterSpacing: '-3px', margin: '0 0px' },
  { name: 'ディストーション！！', src: '/music/2. Distortion!!.mp3', letterSpacing: '-5px', margin: '0 0px' },
  { name: 'カラカラ', src: '/music/3. カラカラ.mp3', letterSpacing: '16px', margin: '0 2px' },
  { name: 'ギターと孤独と蒼い惑星', src: '/music/4. ギターと孤独と蒼い惑星.mp3', letterSpacing: '0px', margin: '0 -4px' },
  { name: 'ひとりぼっち東京', src: '/music/5. ひとりぼっち東京.mp3', letterSpacing: '-2px', margin: '0 0px' },
  { name: 'あのバンド', src: '/music/6. あのバンド.mp3', letterSpacing: '6px', margin: '0 2px' },
  { name: '忘れてやらない', src: '/music/7. 忘れてやらない.mp3', letterSpacing: '0px', margin: '0 0px' },
  { name: 'なにが悪い', src: '/music/9. なにが悪い.mp3', letterSpacing: '6px', margin: '0 2px' },
  { name: '星座になれたら', src: '/music/10. 星座になれたら.mp3', letterSpacing: '4px', margin: '0 0px' },
  { name: 'フラッシュバッカー', src: '/music/11. フラッシュバッカー.mp3', letterSpacing: '4px', margin: '0 0px' },
  { name: '小さな海', src: '/music/12. 小さな海.mp3', letterSpacing: '6px', margin: '0 2px' },
  { name: 'ひみつ基地', src: '/music/13. ひみつ基地.mp3', letterSpacing: '6px', margin: '0 2px' },
  { name: '光の中へ', src: '/music/14. 光の中へ.mp3', letterSpacing: '6px', margin: '0 2px' },
  { name: '青い春と西の空', src: '/music/15. 青い春と西の空.mp3', letterSpacing: '4px', margin: '0 0px' },
  { name: 'ラブソングが歌えない', src: '/music/16. ラブソングが歌えない.mp3', letterSpacing: '2px', margin: '0 -2px' },
];

const INK = '#1C1C1C';
const RED = '#E5453A';
const YELLOW = '#F5C518';
const BLUE = '#2E62D9';
const WHITE = '#FFFFFF';

const SCATTER_OFFSETS = [
  { rot: -14, x: -1, y: 5 },
  { rot: 16, x: 1, y: -6 },
  { rot: -8, x: 0, y: 3 },
  { rot: 12, x: 2, y: -4 },
  { rot: -18, x: -1, y: 6 },
  { rot: 9, x: 1, y: -3 },
  { rot: -11, x: 0, y: 4 },
  { rot: 15, x: 1, y: -5 },
];

function WobbleText({
  text,
  className,
  letterSpacing = '4px',
  margin = '0 0px'
}: {
  text: string;
  className?: string;
  letterSpacing?: string;
  margin?: string;
}) {
  const numericGap = parseInt(letterSpacing, 10) || 0;
  const isWideGap = numericGap >= 10;

  // Jika minus, paksa Flexbox gap jadi 0px, lalu gunakan nilai minus untuk margin huruf
  const isNegative = numericGap < 0;
  const flexGap = isNegative ? '0px' : letterSpacing;

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        whiteSpace: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: flexGap,
      }}
    >
      {isWideGap && (
        <span
          style={{
            position: 'absolute',
            top: '100%',
            left: '-8px',
            right: '-8px',
            height: '14px',
            backgroundColor: WHITE,
            borderRadius: '999px',
            transform: 'translateY(-50%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {text.split('').map((ch, i, arr) => {
        const s = SCATTER_OFFSETS[i % SCATTER_OFFSETS.length];
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-block',
              transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`,
              margin: margin,
              // Jika nilainya minus, tarik huruf berikutnya ke kiri
              marginRight: isNegative && i < arr.length - 1 ? letterSpacing : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(tracks[currentTrack].src);
    audioRef.current.volume = isMuted ? 0 : volume;

    audioRef.current.addEventListener('loadedmetadata', () => {
      if (audioRef.current) setDuration(audioRef.current.duration);
    });

    audioRef.current.addEventListener('ended', () => {
      nextTrack();
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (progressRef.current) clearInterval(progressRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    audio.src = tracks[currentTrack].src;
    audio.load();
    setProgress(0);
    setDuration(0);
    if (isPlaying) audio.play().catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => { });
      progressRef.current = setInterval(() => {
        if (audioRef.current) setProgress(audioRef.current.currentTime);
      }, 250);
    } else {
      audioRef.current.pause();
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    }
    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, []);

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setVolume(ratio);
    setIsMuted(false);
  };

  const track = tracks[currentTrack];
  const seekPct = duration ? (progress / duration) * 100 : 0;
  const volPct = isMuted ? 0 : volume * 100;
  const displayName = track.name.length > 12 ? track.name.slice(0, 12) + '…' : track.name;

  return (
    <div className="fixed bottom-2 right-2 z-50 select-none" style={{ width: 288, height: 178 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Kosugi+Maru&display=swap');

        .qmm * { font-family: 'Kosugi Maru', sans-serif; box-sizing: border-box; }
        .qmm-wobble { font-family: 'Mochiy Pop One', 'Kosugi Maru', sans-serif; }

        .qmm-outline {
          color: ${WHITE};
          -webkit-text-stroke: 5px ${INK};
          paint-order: stroke fill;
        }

        .qmm-piece { position: absolute; }

        .qmm-sticker-group {
          position: absolute;
          inset: 0;
          filter: 
            drop-shadow(3px 0 0 ${WHITE}) 
            drop-shadow(-3px 0 0 ${WHITE}) 
            drop-shadow(0 3px 0 ${WHITE}) 
            drop-shadow(0 -3px 0 ${WHITE}) 
            drop-shadow(3px 3px 0 ${WHITE}) 
            drop-shadow(-3px -3px 0 ${WHITE}) 
            drop-shadow(3px -3px 0 ${WHITE}) 
            drop-shadow(-3px 3px 0 ${WHITE})
            drop-shadow(5px 5px 0 ${INK})
            drop-shadow(0 6px 6px rgba(0,0,0,0.3));
        }

        .qmm-ruler {
          border: 2.5px solid ${INK};
          border-radius: 999px;
          background:
            repeating-linear-gradient(90deg, ${INK} 0 1.5px, transparent 1.5px 9px),
            ${WHITE};
          background-position: center;
          cursor: pointer;
        }
        .qmm-ruler-thumb {
          position: absolute;
          top: 50%;
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 8px solid ${INK};
          transform: translate(-50%, -2px);
          pointer-events: none;
        }

        .qmm-tribar {
          border: 2.5px solid ${INK};
          border-radius: 999px;
          overflow: hidden;
          display: flex;
          cursor: pointer;
        }
        .qmm-tribar-mask {
          position: absolute; top: 0; right: 0; bottom: 0;
          background: rgba(255,255,255,0.72);
          border-left: 2px solid ${INK};
        }

        .qmm-btn {
          background: ${WHITE};
          border: 2.5px solid ${INK};
          display: flex; align-items: center; justify-content: center;
          color: ${INK};
          transition: transform 0.12s ease;
          flex-shrink: 0;
        }
        .qmm-btn:hover { transform: scale(1.08); }
        .qmm-btn:active { transform: scale(0.94); }

        .qmm-play {
          background: ${BLUE};
          border: 3px solid ${INK};
          color: ${WHITE};
          border-radius: 999px;
        }

        .qmm-bubble {
          background: ${WHITE};
          border: 2px solid ${INK};
          border-radius: 6px;
        }
        .qmm-bubble::after {
          content: '';
          position: absolute;
          bottom: -5px; left: 8px;
          width: 8px; height: 8px;
          background: ${WHITE};
          border-right: 2px solid ${INK};
          border-bottom: 2px solid ${INK};
          transform: rotate(45deg);
        }

        .qmm-disc-spin { animation: qmm-spin 2.4s linear infinite; }
        @keyframes qmm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .qmm-pulse { animation: qmm-pulse 1.4s ease-in-out infinite; }
        @keyframes qmm-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }

        .qmm-caption { font-size: 10px; color: #6b6b6b; }
      `}</style>

      <div className="qmm relative w-full h-full">
        <div className="qmm-sticker-group">
          {/* Header */}
          <div className="qmm-piece flex items-center justify-center" style={{ top: -12, left: 14, width: 180, zIndex: 5 }}>
            <div
              className={"flex items-center justify-center rounded-full font-black text-white qmm-wobble " + (isPlaying ? 'qmm-disc-spin' : '')}
              style={{
                width: 42, height: 42, background: INK, border: `3px solid ${WHITE}`,
                fontSize: '26px', transform: 'rotate(-10deg)', zIndex: 6
              }}
            >
              再
            </div>
            <span
              className="qmm-wobble font-black text-3xl"
              style={{
                color: WHITE,
                WebkitTextStroke: `4px ${INK}`,
                paintOrder: 'stroke fill',
                transform: 'rotate(6deg) translate(-4px, 2px)',
                zIndex: 5
              }}
            >
              生
            </span>
            <div
              className="qmm-bubble flex items-center justify-center relative ml-1"
              style={{ width: 22, height: 18, transform: 'rotate(8deg)', zIndex: 6 }}
            >
              <Music className={`w-3 h-3 ${isPlaying ? 'qmm-pulse' : ''}`} style={{ color: INK }} />
            </div>
          </div>

          {/* Prev Button & Track Title */}
          <div className="qmm-piece flex items-center gap-2" style={{ top: 38, left: 12, zIndex: 3 }}>
            <button
              onClick={prevTrack}
              aria-label="Previous track"
              className="qmm-btn rounded-md"
              style={{
                width: 24, height: 24,
                transform: 'rotate(-6deg)', zIndex: 6
              }}
            >
              <SkipBack className="w-3 h-3" />
            </button>

            {/* Mengirimkan nilai letterSpacing dan margin khusus dari objek track yang sedang diputar */}
            <WobbleText
              text={displayName}
              letterSpacing={track.letterSpacing}
              margin={track.margin}
              className="qmm-wobble qmm-outline text-xl leading-none font-black text-center"
            />
          </div>

          {/* Nomor Track */}
          <span
            className="qmm-piece qmm-wobble font-black"
            style={{
              top: 22, right: 2, fontSize: 56, lineHeight: 1, color: RED,
              WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill',
              transform: 'rotate(-9deg)', zIndex: 4,
            }}
          >
            {String(currentTrack + 1).padStart(2, '0')}
          </span>

          {/* Seek Bar */}
          <div
            className="qmm-piece qmm-ruler"
            onClick={handleSeekClick}
            style={{ top: 76, left: 20, width: 175, height: 12, transform: 'rotate(-1deg)', zIndex: 2 }}
          >
            <div className="qmm-ruler-thumb" style={{ left: `${seekPct}%` }} />
          </div>

          {/* Volume Bar */}
          <div
            className="qmm-piece qmm-tribar"
            onClick={handleVolumeClick}
            style={{ top: 90, left: 14, width: 185, height: 13, transform: 'rotate(-1deg)', zIndex: 1 }}
          >
            <div style={{ width: '50%', background: RED }} />
            <div style={{ width: '25%', background: YELLOW }} />
            <div style={{ width: '25%', background: BLUE }} />
            <div className="qmm-tribar-mask" style={{ width: `${100 - volPct}%` }} />
          </div>

          {/* Next Button */}
          <button
            onClick={nextTrack}
            aria-label="Next track"
            className="qmm-piece qmm-btn rounded-md"
            style={{ top: 82, right: 54, width: 26, height: 26, transform: 'rotate(11deg)', zIndex: 6 }}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="qmm-piece qmm-play flex items-center justify-center"
            style={{ top: 104, left: 32, width: 40, height: 40, transform: 'rotate(-12deg)', zIndex: 7 }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="qmm-piece qmm-btn rounded-lg"
            style={{ top: 108, right: 78, width: 28, height: 28, transform: 'rotate(-10deg)', zIndex: 6 }}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;