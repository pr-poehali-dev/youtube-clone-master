import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { AdminTab, BoostType, CommentSentiment } from '@/data/types';
import { ALL_VIDEOS, CHANNELS, MOCK_USERS, FAKE_NAMES, FAKE_AVATARS, formatNumber } from '@/data/mockData';

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

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
}
function StatCard({ label, value, icon, color, change }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white font-display">{value}</p>
          {change && <p className="text-xs text-green-400 mt-1">{change}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: color + '20', border: `1px solid ${color}30` }}>
          <Icon name={icon} size={20} fallback="Circle" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('analytics');
  const [boostType, setBoostType] = useState<BoostType>('subscribers');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [boostAmount, setBoostAmount] = useState(1000);
  const [commentSentiment, setCommentSentiment] = useState<CommentSentiment>('positive');
  const [commentCount, setCommentCount] = useState(10);
  const [boostLog, setBoostLog] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [moderationItems, setModerationItems] = useState(
    ALL_VIDEOS.slice(0, 5).map(v => ({ ...v, status: 'active' as 'active' | 'blocked' }))
  );

  const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
    { id: 'boost', label: 'Накрутки', icon: 'Zap' },
    { id: 'moderation', label: 'Модерация', icon: 'Shield' },
    { id: 'users', label: 'Пользователи', icon: 'Users' },
    { id: 'content', label: 'Контент', icon: 'Video' },
  ];

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
    <div className="animate-fade-in">
      {/* Admin header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center animate-pulse-glow"
          style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <Icon name="Shield" size={20} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white font-display">Панель администратора</h1>
          <p className="text-xs text-white/40">Управление платформой ViewTube</p>
        </div>
        <div className="ml-auto px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)', color: 'hsl(0,85%,60%)' }}>
          ADMIN ACCESS
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-2xl mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              tab === t.id ? 'btn-brand' : 'text-white/50 hover:text-white/80 hover:bg-white/06'
            }`}>
            <Icon name={t.icon} size={15} fallback="Circle" />
            {t.label}
          </button>
        ))}
      </div>

      {/* === ANALYTICS === */}
      {tab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Всего видео" value={ALL_VIDEOS.length} icon="Video" color="#ef4444" change="+3 за неделю" />
            <StatCard label="Пользователи" value={formatNumber(MOCK_USERS.length + 1)} icon="Users" color="#6366f1" change="+12 сегодня" />
            <StatCard label="Просмотры (всего)" value={formatNumber(ALL_VIDEOS.reduce((s, v) => s + v.views, 0))} icon="Eye" color="#22c55e" change="+8.4% к прошлой неделе" />
            <StatCard label="Лайки (всего)" value={formatNumber(ALL_VIDEOS.reduce((s, v) => s + v.likes, 0))} icon="Heart" color="#f59e0b" change="+15.2%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top channels */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Топ каналы</h3>
              <div className="space-y-3">
                {CHANNELS.slice(0, 5).map((ch, i) => (
                  <div key={ch.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/30 w-4">{i + 1}</span>
                    <img src={ch.avatar} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/80 truncate">{ch.name}</p>
                      <div className="h-1.5 bg-white/08 rounded-full mt-1">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${(ch.subscribers / 5100000) * 100}%`, background: 'linear-gradient(90deg, hsl(0,85%,55%), hsl(20,90%,60%))' }} />
                      </div>
                    </div>
                    <span className="text-xs text-white/45 font-medium">{formatNumber(ch.subscribers)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top videos */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Топ видео по просмотрам</h3>
              <div className="space-y-3">
                {[...ALL_VIDEOS].sort((a, b) => b.views - a.views).slice(0, 5).map((v, i) => (
                  <div key={v.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/30 w-4">{i + 1}</span>
                    <img src={v.thumbnail} className="w-12 h-8 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/80 truncate">{v.title}</p>
                      <p className="text-xs text-white/35">{v.type === 'short' ? '⚡ Short' : '▶ Видео'}</p>
                    </div>
                    <span className="text-xs text-white/50">{formatNumber(v.views)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories chart */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Контент по категориям</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {['Технологии', 'Игры', 'Кулинария', 'Спорт', 'Путешествия', 'Музыка'].map((cat, i) => {
                const count = ALL_VIDEOS.filter(v => v.category === cat).length;
                const pct = (count / ALL_VIDEOS.length) * 100;
                const colors = ['#ef4444', '#6366f1', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];
                return (
                  <div key={cat} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">{cat}</span>
                      <span className="font-medium" style={{ color: colors[i] }}>{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/08 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 15)}%`, background: colors[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* === BOOST === */}
      {tab === 'boost' && (
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
                <button onClick={() => setBoostLog([])} className="text-xs text-white/30 hover:text-white/60">
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
      )}

      {/* === MODERATION === */}
      {tab === 'moderation' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Модерация контента</h3>
            <span className="chip">
              <Icon name="AlertTriangle" size={13} fallback="Circle" />
              {moderationItems.filter(i => i.status === 'active').length} активных
            </span>
          </div>
          <div className="space-y-3">
            {moderationItems.map(item => (
              <div key={item.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <img src={item.thumbnail} className="w-20 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/90 truncate">{item.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-white/45">{item.channel.name}</p>
                    <span className="text-xs text-white/30">·</span>
                    <p className="text-xs text-white/45">{formatNumber(item.views)} просмотров</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.status === 'active'
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-red-400 bg-red-400/10'
                    }`}>
                      {item.status === 'active' ? 'Активно' : 'Заблокировано'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModerationItems(items => items.map(i => i.id === item.id ? { ...i, status: i.status === 'active' ? 'blocked' : 'active' } : i))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      item.status === 'active'
                        ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-400/20'
                        : 'bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-400/20'
                    }`}>
                    {item.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === USERS === */}
      {tab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Управление пользователями</h3>
            <span className="chip"><Icon name="Users" size={13} fallback="Circle" />{MOCK_USERS.length + 1} всего</span>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Пользователь', 'Email', 'Роль', 'Подписки', 'Действия'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[{ ...MOCK_USERS[0], id: 'admin', username: 'admin_123', email: 'admin@viewtube.ru', role: 'admin' as const }, ...MOCK_USERS].map((u, i) => (
                  <tr key={u.id} className="transition-colors hover:bg-white/03"
                    style={{ borderBottom: i < MOCK_USERS.length ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium text-white/80">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-white/45">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        u.role === 'admin' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'
                      }`}>
                        {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-white/45">{u.subscribedChannels.length}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-400 hover:underline">Изменить</button>
                        {u.role !== 'admin' && (
                          <button className="text-xs text-red-400 hover:underline">Заблокировать</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === CONTENT === */}
      {tab === 'content' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Управление контентом</h3>
            <div className="flex gap-2">
              <span className="chip"><Icon name="Video" size={13} fallback="Circle" />{ALL_VIDEOS.filter(v => v.type === 'video').length} видео</span>
              <span className="chip active"><Icon name="Zap" size={13} fallback="Circle" />{ALL_VIDEOS.filter(v => v.type === 'short').length} Shorts</span>
            </div>
          </div>
          <div className="space-y-3">
            {ALL_VIDEOS.map(v => (
              <div key={v.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <img src={v.thumbnail} className={`object-cover rounded-xl flex-shrink-0 ${v.type === 'short' ? 'w-10 h-16' : 'w-20 h-12'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white/90 truncate">{v.title}</p>
                    {v.type === 'short' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white flex-shrink-0"
                        style={{ background: 'hsl(0,85%,55%)' }}>SHORT</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <p className="text-xs text-white/45">{v.channel.name}</p>
                    <p className="text-xs text-white/30">{formatNumber(v.views)} просмотров</p>
                    <p className="text-xs text-white/30">{formatNumber(v.likes)} лайков</p>
                    <p className="text-xs text-white/30">{v.comments.length} комментариев</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-xl text-xs font-medium glass text-white/60 hover:text-white/90 transition-colors">
                    <Icon name="Edit" size={12} fallback="Circle" />
                  </button>
                  <button className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-400/15 transition-all">
                    <Icon name="Trash2" size={12} fallback="Circle" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
