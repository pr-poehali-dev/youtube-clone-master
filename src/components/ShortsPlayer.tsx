import { useState, useRef, useEffect } from 'react';
import { Video, User } from '@/data/types';
import { formatNumber, SHORTS } from '@/data/mockData';
import Icon from '@/components/ui/icon';

interface ShortsPlayerProps {
  initialShort?: Video;
  currentUser: User | null;
  onLogin: () => void;
}

export default function ShortsPlayer({ initialShort, currentUser, onLogin }: ShortsPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(
    initialShort ? SHORTS.findIndex(s => s.id === initialShort.id) : 0
  );
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>({});
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = SHORTS[currentIndex] || SHORTS[0];

  const go = (dir: 1 | -1) => {
    const next = currentIndex + dir;
    if (next >= 0 && next < SHORTS.length) setCurrentIndex(next);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  // Wheel scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) setCurrentIndex(i => Math.min(i + 1, SHORTS.length - 1));
      else if (e.deltaY < -30) setCurrentIndex(i => Math.max(i - 1, 0));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleLike = (id: string) => {
    if (!currentUser) { onLogin(); return; }
    setLiked(l => ({ ...l, [id]: !l[id] }));
  };

  return (
    <div ref={containerRef} className="flex items-center justify-center gap-6 h-full min-h-screen py-16">
      {/* Main short */}
      <div className="relative" style={{ width: 360, height: 640 }}>
        <div className="relative w-full h-full rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 120px rgba(239,68,68,0.15)' }}>
          {/* Video */}
          <video
            ref={videoRef}
            src={current.videoUrl}
            poster={current.thumbnail}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.75) 100%)' }} />

          {/* Top overlay: channel */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-2">
            <img src={current.channel.avatar} className="w-9 h-9 rounded-full ring-2 ring-white/20 object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white drop-shadow">{current.channel.name}</p>
            </div>
            <button onClick={() => setSubscribed(s => ({ ...s, [current.channel.id]: !s[current.channel.id] }))}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                subscribed[current.channel.id]
                  ? 'bg-white/20 text-white/80'
                  : 'bg-white text-black'
              }`}>
              {subscribed[current.channel.id] ? 'Подписан' : 'Подписаться'}
            </button>
          </div>

          {/* Navigation arrows */}
          <button onClick={() => go(-1)} disabled={currentIndex === 0}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-80px] w-10 h-10 flex items-center justify-center rounded-full glass opacity-0 hover:opacity-100 transition-opacity disabled:invisible">
            <Icon name="ChevronUp" size={20} className="text-white" />
          </button>
          <button onClick={() => go(1)} disabled={currentIndex === SHORTS.length - 1}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[80px] w-10 h-10 flex items-center justify-center rounded-full glass opacity-0 hover:opacity-100 transition-opacity disabled:invisible">
            <Icon name="ChevronDown" size={20} className="text-white" />
          </button>

          {/* Bottom: title */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-semibold text-white leading-snug drop-shadow">{current.title}</p>
            <div className="flex items-center gap-2 mt-1">
              {current.tags.map(t => (
                <span key={t} className="text-xs text-blue-300 opacity-80">#{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="absolute right-[-60px] bottom-20 flex flex-col items-center gap-5">
          {/* Like */}
          <button onClick={() => handleLike(current.id)}
            className="flex flex-col items-center gap-1">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center glass transition-all ${
              liked[current.id] ? 'bg-red-500/40 border-red-400/50' : 'hover:bg-white/10'
            }`}>
              <Icon name="Heart" size={22}
                className={`transition-all ${liked[current.id] ? 'text-red-400 animate-like-bounce' : 'text-white'}`} />
            </div>
            <span className="text-xs text-white/70 font-medium">
              {formatNumber(current.likes + (liked[current.id] ? 1 : 0))}
            </span>
          </button>

          {/* Comment */}
          <button onClick={() => setShowComment(!showComment)}
            className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full flex items-center justify-center glass hover:bg-white/10 transition-all">
              <Icon name="MessageCircle" size={22} className="text-white" />
            </div>
            <span className="text-xs text-white/70">{formatNumber(current.comments.length)}</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full flex items-center justify-center glass hover:bg-white/10 transition-all">
              <Icon name="Share2" size={22} className="text-white" />
            </div>
            <span className="text-xs text-white/70">Поделиться</span>
          </button>

          {/* More */}
          <button className="w-11 h-11 rounded-full flex items-center justify-center glass hover:bg-white/10 transition-all">
            <Icon name="MoreVertical" size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
        {SHORTS.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all ${
              i === currentIndex ? 'w-1.5 h-5 bg-white' : 'w-1.5 h-1.5 bg-white/30'
            }`} />
        ))}
      </div>

      {/* Up/Down controls */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ top: 'calc(50% - 380px)' }}>
        <button onClick={() => go(-1)} disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full glass flex items-center justify-center disabled:opacity-20 hover:bg-white/15 transition-all">
          <Icon name="ChevronUp" size={20} className="text-white" />
        </button>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ top: 'calc(50% + 340px)' }}>
        <button onClick={() => go(1)} disabled={currentIndex === SHORTS.length - 1}
          className="w-10 h-10 rounded-full glass flex items-center justify-center disabled:opacity-20 hover:bg-white/15 transition-all">
          <Icon name="ChevronDown" size={20} className="text-white" />
        </button>
      </div>

      {/* Comment panel */}
      {showComment && (
        <div className="absolute bottom-0 left-0 right-0 glass-heavy rounded-t-3xl p-6 animate-slide-up z-50 max-h-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Комментарии</h3>
            <button onClick={() => setShowComment(false)}>
              <Icon name="X" size={18} className="text-white/60" />
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-48 mb-4">
            {current.comments.slice(0, 8).map(c => (
              <div key={c.id} className="flex gap-2">
                <img src={c.authorAvatar} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-white/80">{c.authorName} </span>
                  <span className="text-xs text-white/60">{c.text}</span>
                </div>
              </div>
            ))}
          </div>
          {currentUser ? (
            <div className="flex gap-2">
              <input value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Ваш комментарий..."
                className="flex-1 bg-white/08 border border-white/12 rounded-full px-4 py-2 text-sm text-white placeholder-white/30 outline-none" />
              <button className="btn-brand px-4 py-2 rounded-full text-sm font-medium">
                <Icon name="Send" size={15} />
              </button>
            </div>
          ) : (
            <button onClick={onLogin} className="text-sm text-blue-400 hover:underline">
              Войдите, чтобы комментировать
            </button>
          )}
        </div>
      )}
    </div>
  );
}