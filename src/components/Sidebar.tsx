import Icon from '@/components/ui/icon';
import { AppPage } from '@/data/types';

interface SidebarProps {
  open: boolean;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isAdmin?: boolean;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'trending', label: 'В тренде', icon: 'TrendingUp' },
  { id: 'shorts', label: 'Shorts', icon: 'Zap', badge: 'NEW' },
  { id: 'subscriptions', label: 'Подписки', icon: 'Rss' },
  { id: 'library', label: 'Библиотека', icon: 'BookOpen' },
];

const EXPLORE_ITEMS = [
  { id: 'trending', label: 'Популярное', icon: 'Flame' },
  { label: 'Музыка', icon: 'Music' },
  { label: 'Игры', icon: 'Gamepad2' },
  { label: 'Новости', icon: 'Newspaper' },
  { label: 'Спорт', icon: 'Trophy' },
  { label: 'Наука', icon: 'Microscope' },
];

export default function Sidebar({ open, currentPage, onNavigate, isAdmin }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => onNavigate(currentPage)} />
      )}

      <aside
        className={`fixed left-0 top-14 bottom-0 z-40 transition-all duration-300 ease-in-out overflow-y-auto
          ${open ? 'w-56 translate-x-0' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'}`}
        style={{ scrollbarWidth: 'none' }}
      >
        <div className={`h-full glass-heavy border-r transition-all duration-300 ${open ? 'opacity-100' : 'lg:opacity-100 opacity-0'}`}
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <nav className="p-2 space-y-0.5">
            {/* Main nav */}
            {NAV_ITEMS.map((item, i) => {
              const isActive = currentPage === item.id;
              return (
                <button key={item.id || i}
                  onClick={() => item.id && onNavigate(item.id as AppPage)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-white'
                      : 'text-white/55 hover:text-white/90 hover:bg-white/06'
                    }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(239,68,68,0.1))',
                    border: '1px solid rgba(239,68,68,0.2)',
                    boxShadow: '0 0 12px rgba(239,68,68,0.15)',
                  } : {}}>
                  <Icon name={item.icon} size={18} fallback="Circle"
                    className={isActive ? 'text-red-400' : 'text-white/50'} />
                  {open && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                  {open && item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: 'hsl(0,85%,55%)' }}>{item.badge}</span>
                  )}
                </button>
              );
            })}

            {/* Divider */}
            {open && (
              <>
                <div className="h-px bg-white/06 my-3 mx-2" />
                <p className="px-3 py-1 text-[11px] font-semibold text-white/25 uppercase tracking-wider">Обзор</p>
                {EXPLORE_ITEMS.map((item, i) => (
                  <button key={i}
                    onClick={() => item.id && onNavigate(item.id as AppPage)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/55 hover:text-white/90 hover:bg-white/06 transition-all">
                    <Icon name={item.icon} size={17} fallback="Circle" className="text-white/40" />
                    <span>{item.label}</span>
                  </button>
                ))}

                {isAdmin && (
                  <>
                    <div className="h-px bg-white/06 my-3 mx-2" />
                    <p className="px-3 py-1 text-[11px] font-semibold text-red-400/60 uppercase tracking-wider">Администратор</p>
                    <button onClick={() => onNavigate('admin')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${currentPage === 'admin' ? 'text-red-400' : 'text-white/55 hover:text-red-400 hover:bg-red-500/08'}`}>
                      <Icon name="Shield" size={18} className="text-red-400/70" />
                      <span>Админ-панель</span>
                    </button>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
