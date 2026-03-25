import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { AdminTab } from '@/data/types';
import { ALL_VIDEOS, MOCK_USERS, formatNumber } from '@/data/mockData';

interface AdminModerationUsersProps {
  tab: AdminTab;
}

export default function AdminModerationUsers({ tab }: AdminModerationUsersProps) {
  const [moderationItems, setModerationItems] = useState(
    ALL_VIDEOS.slice(0, 5).map(v => ({ ...v, status: 'active' as 'active' | 'blocked' }))
  );

  if (tab === 'moderation') {
    return (
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
    );
  }

  // tab === 'users'
  return (
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
  );
}
