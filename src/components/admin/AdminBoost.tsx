import Icon from '@/components/ui/icon';
import { BoostType, CommentSentiment } from '@/data/types';
import { ALL_VIDEOS, CHANNELS, FAKE_NAMES, FAKE_AVATARS, formatNumber } from '@/data/mockData';

const POSITIVE_COMMENTS = [
  'Отличный контент, продолжай в том же духе!',
  'Лучшее видео, что я видел за последнее время!',
  'Подписался! Очень полезно и информативно.',
  'Просто шедевр. Спасибо огромное!',
  'Смотрел на одном дыхании, жду ещё!',
  'Лайк, подписка, колокольчик — заслуженно!',
  'Это именно то, что я искал. Спасибо!',
  'Невероятно качественный материал!',
];
const NEUTRAL_COMMENTS = [
  'Интересно, подумаю над этим.',
  'Неплохо, есть что взять на заметку.',
  'Посмотрел, спасибо за информацию.',
  'Хм, некоторые моменты спорны, но в целом ок.',
  'Видел похожее раньше, но тут по-другому подано.',
  'Сойдёт. Жду следующего видео.',
];
const HATE_COMMENTS = [
  'Потратил время впустую.',
  'Скучно и неинтересно, дизлайк.',
  'Это не стоит просмотра, честно.',
  'Хуже контента не видел.',
  'Отписался. Такое не смотрю.',
];

interface AdminBoostProps {
  boostType: BoostType;
  setBoostType: (v: BoostType) => void;
  selectedTarget: string;
  setSelectedTarget: (v: string) => void;
  boostAmount: number;
  setBoostAmount: (v: number) => void;
  commentSentiment: CommentSentiment;
  setCommentSentiment: (v: CommentSentiment) => void;
  boostLog: string[];
  setBoostLog: (fn: (l: string[]) => string[]) => void;
  processing: boolean;
  setProcessing: (v: boolean) => void;
}

export default function AdminBoost({
  boostType, setBoostType,
  selectedTarget, setSelectedTarget,
  boostAmount, setBoostAmount,
  commentSentiment, setCommentSentiment,
  boostLog, setBoostLog,
  processing, setProcessing,
}: AdminBoostProps) {

  const runBoost = () => {
    if (!selectedTarget || processing) return;
    setProcessing(true);
    const targetName = boostType === 'subscribers'
      ? CHANNELS.find(c => c.id === selectedTarget)?.name || selectedTarget
      : ALL_VIDEOS.find(v => v.id === selectedTarget)?.title?.slice(0, 30) + '...' || selectedTarget;

    const actionLabels: Record<BoostType, string> = {
      subscribers: `подписчиков на канал «${targetName}»`,
      likes: `лайков на видео «${targetName}»`,
      views: `просмотров на видео «${targetName}»`,
      comments: `${commentSentiment === 'positive' ? 'позитивных' : commentSentiment === 'neutral' ? 'нейтральных' : 'негативных'} комментариев на видео «${targetName}»`,
    };

    setTimeout(() => {
      const msg = `✓ +${formatNumber(boostAmount)} ${actionLabels[boostType]}`;
      setBoostLog(l => [msg, ...l].slice(0, 20));
      setProcessing(false);
    }, 1500);
  };

  const runDecrease = () => {
    if (!selectedTarget || processing) return;
    setProcessing(true);
    const targetName = CHANNELS.find(c => c.id === selectedTarget)?.name || selectedTarget;
    setTimeout(() => {
      const msg = `✓ −${formatNumber(boostAmount)} подписчиков с канала «${targetName}»`;
      setBoostLog(l => [msg, ...l].slice(0, 20));
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-base font-bold text-white">Инструменты накрутки</h3>

        {/* Boost type */}
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Тип накрутки</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: 'subscribers', label: 'Подписчики', icon: 'Users' },
              { id: 'likes', label: 'Лайки', icon: 'Heart' },
              { id: 'views', label: 'Просмотры', icon: 'Eye' },
              { id: 'comments', label: 'Комментарии', icon: 'MessageCircle' },
            ] as { id: BoostType; label: string; icon: string }[]).map(b => (
              <button key={b.id} onClick={() => setBoostType(b.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  boostType === b.id ? 'btn-brand' : 'glass text-white/60 hover:text-white/90'
                }`}>
                <Icon name={b.icon} size={16} fallback="Circle" />
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target */}
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
            {boostType === 'subscribers' ? 'Выберите канал' : 'Выберите видео'}
          </label>
          <select value={selectedTarget} onChange={e => setSelectedTarget(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <option value="" style={{ background: '#1a1c2e' }}>— Выберите цель —</option>
            {boostType === 'subscribers'
              ? CHANNELS.map(c => <option key={c.id} value={c.id} style={{ background: '#1a1c2e' }}>{c.name}</option>)
              : ALL_VIDEOS.map(v => <option key={v.id} value={v.id} style={{ background: '#1a1c2e' }}>{v.title.slice(0, 50)}</option>)
            }
          </select>
        </div>

        {/* Comment sentiment */}
        {boostType === 'comments' && (
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Тип комментариев</label>
            <div className="flex gap-2">
              {([
                { id: 'positive', label: 'Позитивные', color: '#22c55e' },
                { id: 'neutral', label: 'Нейтральные', color: '#f59e0b' },
                { id: 'hate', label: 'Негативные', color: '#ef4444' },
              ] as { id: CommentSentiment; label: string; color: string }[]).map(s => (
                <button key={s.id} onClick={() => setCommentSentiment(s.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    commentSentiment === s.id ? 'text-white' : 'glass text-white/50'
                  }`}
                  style={commentSentiment === s.id ? { background: s.color + '30', border: `1px solid ${s.color}50`, color: s.color } : {}}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
            Количество: <span className="text-white font-bold">{formatNumber(boostAmount)}</span>
          </label>
          <input type="range" min={10} max={100000} step={10}
            value={boostAmount} onChange={e => setBoostAmount(+e.target.value)}
            className="w-full accent-red-500 cursor-pointer" />
          <div className="flex justify-between text-xs text-white/25 mt-1">
            <span>10</span><span>50K</span><span>100K</span>
          </div>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 flex-wrap">
          {[100, 1000, 5000, 10000, 50000].map(n => (
            <button key={n} onClick={() => setBoostAmount(n)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                boostAmount === n ? 'btn-brand' : 'glass text-white/50 hover:text-white/80'
              }`}>
              +{formatNumber(n)}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={runBoost} disabled={!selectedTarget || processing}
            className="flex-1 py-3 rounded-xl font-semibold text-sm btn-brand disabled:opacity-40 flex items-center justify-center gap-2">
            {processing
              ? <><Icon name="Loader" size={15} className="animate-spin-smooth" /> Накручиваем...</>
              : <><Icon name="TrendingUp" size={15} /> Накрутить</>
            }
          </button>
          {boostType === 'subscribers' && (
            <button onClick={runDecrease} disabled={!selectedTarget || processing}
              className="px-4 py-3 rounded-xl font-semibold text-sm glass text-red-400 border border-red-400/20 disabled:opacity-40 flex items-center gap-2 hover:bg-red-500/10 transition-all">
              <Icon name="TrendingDown" size={15} />
              Убавить
            </button>
          )}
        </div>
      </div>

      {/* Log */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Лог операций</h3>
          {boostLog.length > 0 && (
            <button onClick={() => setBoostLog(() => [])} className="text-xs text-white/30 hover:text-white/60">
              Очистить
            </button>
          )}
        </div>
        {boostLog.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-white/25">
            <Icon name="Terminal" size={32} fallback="Circle" />
            <p className="text-sm">Операций пока нет</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {boostLog.map((log, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl animate-slide-up"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <p className="text-xs text-green-300 font-medium">{log}</p>
              </div>
            ))}
          </div>
        )}

        {/* Comment preview */}
        {boostType === 'comments' && (
          <div className="mt-4 pt-4 border-t border-white/06">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Примеры комментариев</p>
            <div className="space-y-2">
              {(commentSentiment === 'positive' ? POSITIVE_COMMENTS : commentSentiment === 'neutral' ? NEUTRAL_COMMENTS : HATE_COMMENTS).slice(0, 3).map((text, i) => {
                const nameIdx = i % FAKE_NAMES.length;
                return (
                  <div key={i} className="flex items-start gap-2">
                    <img src={FAKE_AVATARS[nameIdx]} className="w-7 h-7 rounded-full flex-shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-white/70">{FAKE_NAMES[nameIdx]} </span>
                      <span className="text-xs text-white/50">{text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
