import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { User } from '@/data/types';

interface HeaderProps {
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onSearch: (q: string) => void;
  onUpload: () => void;
  searchQuery: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  currentUser, onLogin, onLogout, onNavigate, onSearch, onUpload, searchQuery, sidebarOpen, onToggleSidebar,
}: HeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
  };

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3">
      {/* Left: burger + logo */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <button onClick={onToggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all">
          <Icon name={sidebarOpen ? 'X' : 'Menu'} size={20} className="text-white/80" />
        </button>
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
          <div className="w-7 h-5 rounded flex items-center justify-center"
            style={{ background: 'hsl(0,85%,55%)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="4,2 12,7 4,12" fill="white" />
            </svg>
          </div>
          <span className="font-display font-black text-lg tracking-tight text-white">
            View<span style={{ color: 'hsl(0,85%,60%)' }}>Tube</span>
          </span>
        </button>
      </div>

      {/* Center: search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Поиск видео..."
            className="w-full h-9 pl-4 pr-10 rounded-full text-sm text-white placeholder-white/30 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
          />
          {localSearch && (
            <button type="button" onClick={() => { setLocalSearch(''); onSearch(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
        <button type="submit"
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Icon name="Search" size={16} className="text-white/70" />
        </button>
      </form>

      {/* Right: actions */}
      <div className="flex items-center gap-1 ml-2">
        {currentUser ? (
          <>
            {/* Upload */}
            <button onClick={onUpload}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-all btn-brand">
              <Icon name="Plus" size={15} />
              <span className="hidden sm:inline">Загрузить</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all relative">
                <Icon name="Bell" size={18} className="text-white/70" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'hsl(0,85%,55%)' }} />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 w-72 glass rounded-2xl p-3 animate-scale-in z-50">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 mb-2">Уведомления</p>
                  {['TechMaster Pro загрузил новое видео', 'GameZone RU начал стрим', 'Ваше видео набрало 1000 просмотров'].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/05 cursor-pointer">
                      <div className="w-8 h-8 rounded-full flex-shrink-0 skeleton" />
                      <p className="text-xs text-white/70">{n}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 transition-all hover:scale-105"
                style={{ borderColor: 'hsl(0,85%,55%)' }}>
                <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-11 w-52 glass rounded-2xl p-2 animate-scale-in z-50">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-semibold text-white">{currentUser.username}</p>
                    <p className="text-xs text-white/40">{currentUser.email}</p>
                  </div>
                  <div className="h-px bg-white/08 mx-2 mb-1" />
                  {currentUser.role === 'admin' && (
                    <button onClick={() => { onNavigate('admin'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/08 text-sm text-white/80 transition-colors">
                      <Icon name="Shield" size={15} className="text-red-400" />
                      Админ-панель
                    </button>
                  )}
                  <button onClick={() => { onNavigate('channel'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/08 text-sm text-white/80 transition-colors">
                    <Icon name="User" size={15} />
                    Мой канал
                  </button>
                  <button onClick={() => { onLogout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/08 text-sm text-red-400 transition-colors">
                    <Icon name="LogOut" size={15} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button onClick={onLogin}
            className="flex items-center gap-1.5 h-8 px-4 rounded-full text-sm font-medium transition-all btn-brand">
            <Icon name="LogIn" size={14} />
            Войти
          </button>
        )}
      </div>
    </header>
  );
}