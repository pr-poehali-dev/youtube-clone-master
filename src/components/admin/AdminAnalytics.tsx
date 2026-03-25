import Icon from '@/components/ui/icon';
import { ALL_VIDEOS, CHANNELS, MOCK_USERS, formatNumber } from '@/data/mockData';

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

export default function AdminAnalytics() {
  return (
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
  );
}
