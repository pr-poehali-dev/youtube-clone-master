import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 900);
    const t2 = setTimeout(() => setPhase('out'), 2200);
    const t3 = setTimeout(() => onDone(), 2750);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ${
        phase === 'out' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(239,68,68,0.18) 0%, rgba(99,102,241,0.1) 40%, hsl(220,20%,4%) 70%)',
        backdropFilter: 'blur(0px)',
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)', filter: 'blur(80px)', animationDelay: '1s' }} />
      </div>

      {/* Logo container */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo icon */}
        <div className={`animate-splash-logo animate-logo-pulse`}>
          <div className="relative w-28 h-20 flex items-center justify-center">
            {/* Glass card behind logo */}
            <div className="absolute inset-0 rounded-2xl glass"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }} />
            {/* Play button shape */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="relative z-10">
              <circle cx="28" cy="28" r="28" fill="rgba(239,68,68,0.9)" />
              <polygon points="22,18 42,28 22,38" fill="white" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="animate-splash-title flex flex-col items-center gap-1">
          <h1 className="font-display font-black text-5xl tracking-tight text-white"
            style={{ letterSpacing: '-1px' }}>
            View<span className="text-brand-glow">Tube</span>
          </h1>
          <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
            Смотри · Создавай · Делись
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4" style={{ opacity: phase === 'hold' ? 1 : 0, transition: 'opacity 0.3s' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
              style={{ animation: `pulse 1.2s ease infinite ${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
